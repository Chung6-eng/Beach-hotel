package com.codework.beachhotel.Security;

import com.codework.beachhotel.Security.jwt.AuthTokenFilter;
import com.codework.beachhotel.Security.jwt.JwtAuthEntryPoint;
import com.codework.beachhotel.Security.user.HotelUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig {

    private final HotelUserDetailsService userDetailsService;
    private final JwtAuthEntryPoint jwtAuthEntryPoint;

    @Bean
    public AuthTokenFilter authenticationTokenFilter() {
        return new AuthTokenFilter();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // BẬT CORS
                .csrf(AbstractHttpConfigurer::disable)
                .exceptionHandling(exception -> exception.authenticationEntryPoint(jwtAuthEntryPoint))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // 1. CÔNG KHAI - Không cần đăng nhập
                        .requestMatchers("/auth/**").permitAll()

                        // 2. ROOMS - Công khai cho xem, MANAGER cho quản lý
                        .requestMatchers("/rooms/add/**", "/rooms/delete/**", "/rooms/update/**").hasRole("MANAGER")
                        .requestMatchers("/rooms/**").permitAll()

                        // 3. BOOKINGS - Cần đăng nhập
                        .requestMatchers("/bookings/room/*/booking").permitAll() // Đặt phòng công khai
                        .requestMatchers("/bookings/confirmation/*").permitAll() // Xem confirmation công khai
                        .requestMatchers("/bookings/all-bookings").hasAnyRole("STAFF","MANAGER") // Chỉ MANAGER xem tất cả
                        .requestMatchers("/bookings/**").authenticated() // Các endpoint khác cần đăng nhập

                        // 4. USERS - Cần đăng nhập
                        .requestMatchers("/users/**").hasAnyRole("USER","STAFF", "MANAGER")

                        // 5. ROLES - Chỉ MANAGER
                        .requestMatchers("/roles/**").hasAnyRole("MANAGER","STAFF","USER")

                        // 6. TẤT CẢ các request khác - Cần đăng nhập
                        .anyRequest().authenticated()
                );

        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(authenticationTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOriginPattern("*");
        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}