export const apiThunkWrapper = async (asyncFn, thunkAPI) => {
  try {
    return await asyncFn();
  } catch (error) {
    const errData = error?.response?.data;

    return thunkAPI.rejectWithValue(
      errData || { message: "An unexpected error occurred" }
    );
  }
};
