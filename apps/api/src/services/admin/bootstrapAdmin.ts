import bcrypt from "bcryptjs";
import { User } from "../../models/User";

type BootstrapAdminInput = {
  email?: string;
  password?: string;
  name?: string;
};

export async function bootstrapAdmin(input: BootstrapAdminInput) {
  const email = input.email?.trim().toLowerCase();
  const password = input.password;
  const name = input.name?.trim() || "Studio Owner";

  if (!email || !password) {
    return;
  }

  const existing = await User.findOne({ email });
  const passwordHash = await bcrypt.hash(password, 10);

  if (!existing) {
    await User.create({
      name,
      email,
      passwordHash,
      role: "admin"
    });
    return;
  }

  if (existing.role !== "admin" || existing.name !== name) {
    existing.role = "admin";
    existing.name = name;
  }
  existing.passwordHash = passwordHash;
  await existing.save();
}
