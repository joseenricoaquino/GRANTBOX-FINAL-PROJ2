import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/sign-in",
  },
});

export const config = {
  matcher: [
    "/college-scholars/:path*",
    "/dashboard/:path*",
    "/profile/:path*",
    "/scholarships/:path*",
    "/scholarships-compass/:path*",
    "/scholarships-student/:path*",
    "/settings/:path*",
    "/chat/:path*",
  ],
};
