const util = require('util');
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

const UserModel = {
  getUserScheduleInfo: async (id) => {
    try {
      let { data, error } = await supabase
        .from('get_user_info')
        .select()
        .match({ users_id: id });
      supabaseErrorCheck(error);

      return data;
    } catch (e) {
      throw e;
    }
  },
};

module.exports = UserModel;
