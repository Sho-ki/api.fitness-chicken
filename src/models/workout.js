const connection = require('../db');
const supabasejs = require('@supabase/supabase-js');

const supabase = supabasejs.createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

function supabaseErrorCheck(error) {
  if (error) throw error.message;
}

const WorkoutModel = {
  updateWorkoutCategory: async ({ color, userId }) => {
    try {
      let { data, error } = await supabase.from('workout_categories').select().match({ users_id: userId });

      supabaseErrorCheck(error);

      let { error: error2 } = await supabase.from('workout_categories').upsert([
        {
          users_id: userId,
          id: data[0].id,
          color: color.WarmUp,
          category: 'Warm Up',
        },
        {
          users_id: userId,
          id: data[1].id,
          color: color.Arms,
          category: 'Arms',
        },
        {
          users_id: userId,
          id: data[2].id,
          color: color.Legs,
          category: 'Legs',
        },
        {
          users_id: userId,
          id: data[3].id,
          color: color.Chest,
          category: 'Chest',
        },
        {
          users_id: userId,
          id: data[4].id,
          color: color.Abs,
          category: 'Abs',
        },
        {
          users_id: userId,
          id: data[5].id,
          color: color.Glutes,
          category: 'Glutes',
        },
        {
          users_id: userId,
          id: data[6].id,
          color: color.Back,
          category: 'Back',
        },
        {
          users_id: userId,
          id: data[7].id,
          color: color.Shoulders,
          category: 'Shoulders',
        },
        {
          users_id: userId,
          id: data[8].id,
          color: color.UpperBody,
          category: 'Upper Body',
        },
        {
          users_id: userId,
          id: data[9].id,
          color: color.LowerBody,
          category: 'Lower Body',
        },
      ]);

      supabaseErrorCheck(error2);

      return;
    } catch (e) {
      throw e;
    }
  },

  createWorkoutSet: async ({ userId }) => {
    try {
      let { error } = await supabase.from('workout_sets').insert({ users_id: userId });

      supabaseErrorCheck(error);
      return;
    } catch (e) {
      throw e;
    }
  },

  createWorkoutItem: async ({ userId, category, name }) => {
    try {
      let { data, error } = await supabase
        .from('workout_categories')
        .select()
        .match({ users_id: userId, category });

      supabaseErrorCheck(error);

      let { data: data2, error: error2 } = await supabase
        .from('workout_items')
        .select()
        .match({ workout_categories_id: data[0].id, workout_item: name });
      supabaseErrorCheck(error2);

      if (data2.length === 0) {
        const { data: data3, error: error3 } = await supabase
          .from('workout_items')
          .insert({ workout_categories_id: data[0].id, workout_item: name });

        supabaseErrorCheck(error3);
        return data3[0].id;
      }
      return false;
    } catch (e) {
      throw e;
    }
  },

  updateSetItems: async ({ workoutItemIdArray, workoutSetId }) => {
    try {
      let queryValForNew = [];
      workoutItemIdArray.map(async (item) => {
        if (item.id == null) {
          let val = {
            workout_items_id: item.workoutItemId,
            workout_sets_id: Number(workoutSetId),
            set_order: item.order,
            reps: item.reps,
            sets: item.sets,
          };
          queryValForNew.push(val);
        } else {
          let { error } = await supabase
            .from('workout_set_items')
            .update({ set_order: item.order, reps: item.reps, sets: item.sets })
            .match({ id: item.id });

          supabaseErrorCheck(error);
        }
      });

      if (queryValForNew.length > 0) {
        let { error: error2 } = await supabase.from('workout_set_items').insert(queryValForNew);
        supabaseErrorCheck(error2);
      }
      return;
    } catch (e) {
      throw e;
    }
  },

  deleteSetItems: async ({ deleteIdList }) => {
    try {
      for (let i = 0; i < deleteIdList.length; i++) {
        let { error } = await supabase.from('workout_set_items').delete().match({ id: deleteIdList[i] });
        supabaseErrorCheck(error);
      }
      return;
    } catch (e) {
      throw e;
    }
  },

  updateWorkoutItem: async ({ userId, workoutItemId, category, name }) => {
    try {
      let { data, error } = await supabase
        .from('get_workout_items')
        .select()
        .match({ workout_item: name, users_id: userId, category });
      supabaseErrorCheck(error);
      if (data.length > 0) {
        return false;
      }

      let { data: getUserCategoryId, error: error2 } = await supabase
        .from('workout_categories')
        .select()
        .match({ users_id: userId, category });
      supabaseErrorCheck(error2);

      let { error: error3 } = await supabase
        .from('workout_items')
        .update({
          workout_item: name,
          workout_categories_id: getUserCategoryId[0].id,
        })
        .match({ id: workoutItemId });
      supabaseErrorCheck(error3);

      return true;
    } catch (e) {
      throw e;
    }
  },

  deleteWorkoutItem: async ({ workoutItemId }) => {
    try {
      let { error } = await supabase.from('workout_items').delete().match({ id: workoutItemId });
      supabaseErrorCheck(error);
      return;
    } catch (e) {
      throw e;
    }
  },

  getUserWorkoutItems: async ({ userId }) => {
    try {
      let { data, error } = await supabase.from('get_workout_items').select().match({ users_id: userId });
      supabaseErrorCheck(error);
      return data;
    } catch (e) {
      throw e;
    }
  },

  getWorkoutCategory: async ({ userId }) => {
    try {
      let { data, error } = await supabase.from('workout_categories').select().match({ users_id: userId });
      supabaseErrorCheck(error);
      return data;
    } catch (e) {
      throw e;
    }
  },
};

module.exports = WorkoutModel;
