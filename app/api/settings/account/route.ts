import prisma from "@/lib/prismadb";
import bcrypt from "bcrypt";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log(body);

    const {
      oldPass,
      newPass,
      confirmPass,
      userId,
      fullName,
      email,
      contact,
      dob,
      address,
      nationality,
    } = body;

    if (oldPass !== "") {
      console.log({ oldPass, newPass, confirmPass });
      if (newPass === "") {
        return new NextResponse("Missing New Password!", { status: 400 });
      }
      if (confirmPass === "") {
        return new NextResponse("Missing Confirm Password!", { status: 400 });
      }
      if (newPass !== confirmPass) {
        return new NextResponse(
          "New Password doesn't match the Confirm password",
          { status: 400 }
        );
      }
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: { id: true, hashedPassword: true },
      });

      if (!user || !user?.hashedPassword) {
        return new NextResponse("Missing Credentials", { status: 400 });
      }

      const isCorrectPassword = await bcrypt.compare(
        oldPass,
        user.hashedPassword
      );

      if (!isCorrectPassword) {
        return new NextResponse("Old Password doesn't match!", { status: 400 });
      }

      const newHashedPassword = await bcrypt.hash(newPass, 12);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          hashedPassword: newHashedPassword,
          name: fullName,
          email,
          contact,
          dob: new Date(dob),
          address,
          nationality,
        },
      });
    } else {
      await prisma.user.update({
        where: { id: userId },
        data: {
          name: fullName,
          email,
          contact,
          dob: new Date(dob),
          address,
          nationality,
        },
      });
    }

    return NextResponse.json("Updated Successfully");
  } catch (error) {
    console.log(error, "SETTINGS_ACCOUNT_EDIT_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
