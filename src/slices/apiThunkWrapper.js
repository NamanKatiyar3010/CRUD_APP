export const apiThunkWrapper = async (asyncFn, thunkAPI) => {
  try {
    return await asyncFn();
  } catch (error) {
    const errData = error?.response?.data;

    // If detailed error exists, pass it; else fallback to generic message
    return thunkAPI.rejectWithValue(
      errData || { message: "An unexpected error occurred" }
    );
  }
};
