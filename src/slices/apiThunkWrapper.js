export const apiThunkWrapper = async (asyncFn, thunkAPI) => {
  try {
    return await asyncFn();
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.message || "An unexpected error occurred"
    );
  }
};
