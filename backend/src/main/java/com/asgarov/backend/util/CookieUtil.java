package com.asgarov.backend.util;

import lombok.experimental.UtilityClass;
import jakarta.servlet.http.Cookie;

@UtilityClass
public class CookieUtil {

    public static final String DEFAULT_PATH = "/";

    public static Cookie createCookie(String cookieName, String cookieValue, boolean secure, boolean httpOnly, int expiresIn) {
        Cookie cookie = new Cookie(cookieName, cookieValue);
        cookie.setPath(DEFAULT_PATH);
        cookie.setHttpOnly(httpOnly);
        cookie.setSecure(secure);
        cookie.setMaxAge(expiresIn);
        return cookie;
    }
}
