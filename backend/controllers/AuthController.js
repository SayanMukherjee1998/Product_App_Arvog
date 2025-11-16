const  { register, login } = "../services/authService";

export async function registerUser(req, res) {
  try {
    const user = await register(req.body);
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

export async function loginUser(req, res) {
  try {
    const data = await login(req.body);
    res.json({ success: true, ...data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}
