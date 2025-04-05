package com.asgarov.backend.controller;

import com.asgarov.backend.dto.AccessTokenDto;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import static com.asgarov.backend.util.CookieUtil.createCookie;

@RestController
public class CallbackController {

    public static final String GOOGLE_ACCESS_TOKEN = "google_access_token";

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${google.token.url}")
    private String authorizationTokenUrl;

    @GetMapping("callback")
    public String authorizationRedirectUri(@RequestParam String code,
                                           HttpServletResponse response) {
        AccessTokenDto dto = restTemplate.postForObject(authorizationTokenUrl + code, HttpEntity.EMPTY, AccessTokenDto.class);
        response.addCookie(createCookie(GOOGLE_ACCESS_TOKEN, dto.getAccessToken(), false, false, dto.getExpiresIn()));

        return """
                <script>
                    window.close()
                </script>
                """;
    }
}
