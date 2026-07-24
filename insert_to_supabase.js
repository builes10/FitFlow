const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Initialize Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function insertData() {
  try {
    console.log('🚀 Starting data insertion...\n');

    // Read the fitness database JSON
    const fitnessData = JSON.parse(fs.readFileSync('./fitness_database.json', 'utf8'));

    // 1. Insert exercises
    console.log('📝 Inserting exercises...');
    const { data: insertedExercises, error: exercisesError } = await supabase
      .from('exercises')
      .insert(fitnessData.exercises)
      .select();

    if (exercisesError) {
      console.error('❌ Error inserting exercises:', exercisesError);
      return;
    }
    console.log(`✅ Inserted ${insertedExercises.length} exercises\n`);

    // Create a map of exercise names to IDs for later reference
    const exerciseMap = {};
    insertedExercises.forEach(ex => {
      exerciseMap[ex.name] = ex.id;
    });

    // 2. Insert training plans
    console.log('📋 Inserting training plans...');
    const plansToInsert = fitnessData.training_plans.map(plan => ({
      name: plan.name,
      description: plan.description,
      difficulty: plan.difficulty,
      duration_weeks: plan.durationWeeks,
      duration_days: plan.structure.length,
      target_audience: 'All Fitness Levels',
      goals: ['strength', 'cardio', 'endurance']
    }));

    const { data: insertedPlans, error: plansError } = await supabase
      .from('training_plans')
      .insert(plansToInsert)
      .select();

    if (plansError) {
      console.error('❌ Error inserting training plans:', plansError);
      return;
    }
    console.log(`✅ Inserted ${insertedPlans.length} training plans\n`);

    // 3. For each plan, insert days and phases
    console.log('📅 Inserting training days and phases...');
    let totalDays = 0;
    let totalPhases = 0;

    for (let i = 0; i < fitnessData.training_plans.length; i++) {
      const plan = fitnessData.training_plans[i];
      const planId = insertedPlans[i].id;

      for (const dayData of plan.structure) {
        // Insert training day
        const { data: insertedDay, error: dayError } = await supabase
          .from('training_plan_days')
          .insert({
            training_plan_id: planId,
            day_number: plan.structure.indexOf(dayData) + 1,
            day_name: dayData.day,
            day_label: dayData.dayName || dayData.day,
            total_duration: dayData.phases.reduce((sum, p) => sum + p.duration, 0),
            intensity: dayData.intensity || 'moderate'
          })
          .select();

        if (dayError) {
          console.error('❌ Error inserting day:', dayError);
          continue;
        }

        const dayId = insertedDay[0].id;
        totalDays++;

        // Insert phases for this day
        for (let phaseIdx = 0; phaseIdx < dayData.phases.length; phaseIdx++) {
          const phase = dayData.phases[phaseIdx];
          const phaseEmojis = { warmup: '🔥', strength: '💪', wod: '⚡' };

          const { data: insertedPhase, error: phaseError } = await supabase
            .from('training_phases')
            .insert({
              training_plan_day_id: dayId,
              phase_type: phase.phase,
              phase_title: phase.phaseTitle,
              phase_emoji: phaseEmojis[phase.phase] || '',
              duration_minutes: phase.duration,
              order_number: phaseIdx + 1,
              notes: phase.notes || null
            })
            .select();

          if (phaseError) {
            console.error('❌ Error inserting phase:', phaseError);
            continue;
          }

          const phaseId = insertedPhase[0].id;
          totalPhases++;

          // Insert exercises for this phase
          for (let exIdx = 0; exIdx < phase.exercises.length; exIdx++) {
            const exerciseRef = phase.exercises[exIdx];
            
            // Try to find the exercise by ID or name
            let exerciseId = exerciseRef.exerciseId;
            if (!exerciseId && exerciseRef.name) {
              exerciseId = exerciseMap[exerciseRef.name];
            }

            if (!exerciseId) {
              console.warn(`⚠️ Exercise not found: ${exerciseRef.name || exerciseRef.exerciseId}`);
              continue;
            }

            const { error: exError } = await supabase
              .from('training_phase_exercises')
              .insert({
                training_phase_id: phaseId,
                exercise_id: exerciseId,
                reps: exerciseRef.reps || 'Max',
                sets: exerciseRef.sets || 1,
                rest_seconds: exerciseRef.rest || 60,
                exercise_notes: exerciseRef.notes || null,
                order_number: exIdx + 1
              });

            if (exError) {
              console.warn('⚠️ Could not insert exercise reference:', exError.message);
            }
          }
        }
      }
    }

    console.log(`✅ Inserted ${totalDays} training days`);
    console.log(`✅ Inserted ${totalPhases} training phases\n`);

    // 4. Verify data
    console.log('🔍 Verifying data insertion...\n');
    
    const { data: allExercises } = await supabase.from('exercises').select('COUNT(*)');
    const { data: allPlans } = await supabase.from('training_plans').select('COUNT(*)');
    const { data: allDays } = await supabase.from('training_plan_days').select('COUNT(*)');
    const { data: allPhases } = await supabase.from('training_phases').select('COUNT(*)');

    console.log(`📊 Final Stats:`);
    console.log(`   ✅ Total Exercises: ${insertedExercises.length}`);
    console.log(`   ✅ Total Plans: ${insertedPlans.length}`);
    console.log(`   ✅ Total Days: ${totalDays}`);
    console.log(`   ✅ Total Phases: ${totalPhases}\n`);

    console.log('🎉 Data insertion completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

insertData();
