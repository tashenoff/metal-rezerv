import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/**
 * Middleware Next.js для защиты маршрутов приложения
 * Обеспечивает авторизацию и проверку ролей пользователей
 */
export default withAuth(
  function middleware(req) {
    // Получаем текущий путь и данные пользователя
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;
    
    // Проверка роли для маршрутов администратора
    if (pathname.startsWith("/dashboard") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    
    // Проверка роли для маршрутов паблишера
    if (pathname.startsWith("/publisher") && token?.role !== "PUBLISHER") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    
    // Проверка роли для маршрутов респондера
    if (pathname.startsWith("/responder") && token?.role !== "RESPONDER") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    
    // Проверка доступа к странице активности (только для респондеров)
    if (pathname === "/activity" && token?.role !== "RESPONDER") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    
    // Маршруты, которые требуют определенных прав, связанных с компанией
    if (pathname.startsWith("/company") && !token?.companyId && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      // Функция для проверки авторизации - всегда проверяем токен NextAuth
      authorized: ({ token }) => !!token
    }
  }
);

/**
 * Список маршрутов, которые должны быть защищены
 * Соответствует существующей структуре проекта
 */
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/publisher/:path*",
    "/responder/:path*",
    "/activity",
    "/add-points",
    "/profile/:path*",
    "/company/:path*"
  ]
};