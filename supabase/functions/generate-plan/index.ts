// Follow Deno-specific ESM syntax
import { createClient } from "npm:@supabase/supabase-js@2.39.7";
import { OpenAI } from "npm:openai@4.28.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify the JWT and get the user
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid token or user not found');
    }

    // Parse request body
    const { goal, raceType, fitnessLevel, activityCount } = await req.json();

    // Check subscription tier
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('tier, status')
      .eq('user_id', user.id)
      .single();

    if (subError) {
      throw new Error(`Error fetching subscription: ${subError.message}`);
    }

    const isPro = subscription.tier === 'pro' && subscription.status === 'active';

    // Check plan generation limit for free users
    if (!isPro) {
      const { data: plans, error: plansError } = await supabase
        .from('workout_plans')
        .select('created_at')
        .eq('user_id', user.id)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days
        .order('created_at', { ascending: false });

      if (plansError) {
        throw new Error(`Error fetching plans: ${plansError.message}`);
      }

      if (plans && plans.length >= 1) {
        return new Response(
          JSON.stringify({
            error: "Free tier limit reached. You can generate 1 plan per month. Upgrade to Pro for unlimited plans."
          }),
          {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
    }

    // Get recent activities
    const { data: activities, error: activitiesError } = await supabase
      .from('activities')
      .select('type, distance, duration, date')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(activityCount || 10);

    if (activitiesError) {
      throw new Error(`Error fetching activities: ${activitiesError.message}`);
    }

    // Generate a workout plan using OpenAI
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY") || "";
    if (!openaiApiKey) {
      throw new Error("Missing OpenAI API key");
    }

    const openai = new OpenAI({ apiKey: openaiApiKey });

    const prompt = `
      Create a personalized workout plan for a ${fitnessLevel || 'intermediate'} athlete with the following goal: ${goal || 'improve fitness'}.
      ${raceType && raceType !== 'Not training for a race' ? `They are training for a ${raceType}.` : ''}
      
      ${activities && activities.length > 0 ? `
      Here are their recent activities:
      ${activities.map(a => `- ${new Date(a.date).toLocaleDateString()}: ${a.type}, ${(a.distance / 1000).toFixed(2)}km, ${Math.floor(a.duration / 60)} minutes`).join('\n')}
      ` : 'They don\'t have any recent activities tracked.'}
      
      Create a 4-week training plan with 4-5 workouts per week. For each workout, include:
      1. Day of the week
      2. Type of workout (e.g., Running, Cycling, Swimming, Strength, Recovery)
      3. Duration in minutes
      4. Brief description of the workout
      5. Training purpose/goal of this specific workout
      
      Format the response as a JSON array of workout objects with these properties:
      - date (YYYY-MM-DD)
      - type (string)
      - duration (number in minutes)
      - notes (string with description and purpose)
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert fitness coach specializing in endurance sports. Create personalized training plans based on the athlete's goals, race targets, and recent activity history." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const planTitle = `${goal || 'Fitness'} Plan (${new Date().toLocaleDateString()})`;
    const planContent = completion.choices[0]?.message?.content;
    
    if (!planContent) {
      throw new Error("Failed to generate workout plan");
    }

    // Save the plan to the database
    const { data: plan, error: planError } = await supabase
      .from('workout_plans')
      .insert({
        user_id: user.id,
        title: planTitle,
        gpt_prompt: prompt
      })
      .select()
      .single();

    if (planError) {
      throw new Error(`Error saving plan: ${planError.message}`);
    }

    // Parse workouts from the GPT response
    const workouts = JSON.parse(planContent).workouts;

    // Insert all workouts
    const workoutsToInsert = workouts.map((workout: any) => ({
      user_id: user.id,
      plan_id: plan.id,
      date: new Date(workout.date).toISOString(),
      type: workout.type,
      duration: workout.duration,
      notes: workout.notes
    }));

    const { error: workoutsError } = await supabase
      .from('workouts')
      .insert(workoutsToInsert);

    if (workoutsError) {
      throw new Error(`Error saving workouts: ${workoutsError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        plan_id: plan.id,
        title: planTitle,
        workout_count: workouts.length
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (err) {
    console.error("Error:", err.message);
    return new Response(
      JSON.stringify({ error: err.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});