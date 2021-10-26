const util = require('util');
const bcrypt = require('bcrypt');
const connection = require('../db');
const supabasejs = require('@supabase/supabase-js');

const supabase = supabasejs.createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

function supabaseErrorCheck(error) {
  console.log(error);
  if (error) throw error.message;
}

function hashPass(password) {
  if (!password) return null;
  return bcrypt.hashSync(password, 10);
}

const LoginModel = {
  signUp: async (email, password) => {
    try {
      const hashed_password = hashPass(password);

      let { data, error } = await supabase
        .from('users')
        .insert([{ email, password: hashed_password }]);
      supabaseErrorCheck(error);

      return data[0].id;
    } catch (e) {
      throw e;
    }
  },

  createWorkoutCategory: async ({ userId }) => {
    try {
      const { error } = await supabase.from('workout_categories').insert([
        { category: 'Warm Up', users_id: userId },
        { category: 'Arms', users_id: userId },
        { category: 'Legs', users_id: userId },
        { category: 'Chest', users_id: userId },
        { category: 'Abs', users_id: userId },
        { category: 'Glutes', users_id: userId },
        { category: 'Back', users_id: userId },
        { category: 'Shoulders', users_id: userId },
        { category: 'Upper Body', users_id: userId },
        { category: 'Lower Body', users_id: userId },
        { category: null, users_id: userId },
      ]);

      supabaseErrorCheck(error);

      return;
    } catch (e) {
      throw e;
    }
  },

  createWorkoutSet: async ({ userId }) => {
    try {
      const { error } = await supabase.from('workout_sets').insert([
        { day_of_week: 'Sun', users_id: userId },
        { day_of_week: 'Mon', users_id: userId },
        { day_of_week: 'Tue', users_id: userId },
        { day_of_week: 'Wed', users_id: userId },
        { day_of_week: 'Thu', users_id: userId },
        { day_of_week: 'Fri', users_id: userId },
        { day_of_week: 'Sat', users_id: userId },
      ]);

      supabaseErrorCheck(error);

      return;
    } catch (e) {
      throw e;
    }
  },

  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select()
        .match({ email });

      if (data.length <= 0) {
        throw new Error();
      }

      const isValidPass = await bcrypt.compare(password, data[0].password);
      if (!isValidPass) {
        throw new Error();
      }

      return { id: data[0].id };
    } catch (e) {
      throw new Error(e);
    }
  },
};

module.exports = LoginModel;
