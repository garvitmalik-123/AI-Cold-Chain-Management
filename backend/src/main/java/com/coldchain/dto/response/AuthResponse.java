package com.coldchain.dto.response;

import com.coldchain.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String userId;
    private String name;
    private String email;
    private Role role;
}
