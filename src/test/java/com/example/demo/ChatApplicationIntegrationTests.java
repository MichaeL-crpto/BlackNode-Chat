package com.example.demo;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest
@AutoConfigureMockMvc
class ChatApplicationIntegrationTests {

    private static final String PUBLIC_KEY = """
            -----BEGIN PUBLIC KEY-----
            MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAp0yiLt1cFPhaeP/vk3lD
            e/MlP1x4qU69eLCY6z1Vro0bKz1O7YcBBQ7amJebZtsR/pS6G8fTnSY7j1CPeNkW
            dQR8zx0HvKpJCuKfzv93WF4klvK6umjS6qewhfBfXiutqqWwgu1vgIot5tK6wP9u
            EpaQQVw97Dgw5gWRT0Gx0AC9iW2lLJ6JP7qd1JaRlOWBQnUNHjSW8cKAl30pEiWd
            64E/6dsiMi70GXH2oydQsqHzKJjeVCbLJYZfsSNq+so18PUzTH4YIu0sT3W0L8v9
            YTyQxK2xkWA3uhCHHQvB4zfST0fEJ4mc7vM3m4Di87p18E89zqZWEJvUjZ2CBu0x
            3wIDAQAB
            -----END PUBLIC KEY-----
            """;

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void registerUploadKeyCreateChatAndSendEncryptedMessage() throws Exception {
        String aliceToken = register("alice", "password123");
        String bobToken = register("bob", "password123");

        uploadPublicKey(aliceToken);
        uploadPublicKey(bobToken);

        MvcResult chatResult = mockMvc.perform(post("/api/chats")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + aliceToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"partnerUsername\":\"bob\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andReturn();

        Long chatId = objectMapper.readTree(chatResult.getResponse().getContentAsString()).get("id").asLong();

        mockMvc.perform(post("/api/chats/{chatId}/messages", chatId)
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + aliceToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"content\":\"hello bob\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.cipherText").isNotEmpty())
                .andExpect(jsonPath("$.encryptedAesKey").isNotEmpty())
                .andExpect(jsonPath("$.initializationVector").isNotEmpty());

        mockMvc.perform(get("/api/chats/{chatId}/messages", chatId)
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + bobToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].senderUsername").value("alice"))
                .andExpect(jsonPath("$[0].recipientUsername").value("bob"))
                .andExpect(jsonPath("$[0].encryptedAesKey").isNotEmpty());
    }

    private String register(String username, String password) throws Exception {
        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"" + username + "\",\"password\":\"" + password + "\"}"))
                .andExpect(status().isCreated())
                .andReturn();

        JsonNode node = objectMapper.readTree(result.getResponse().getContentAsString());
        return node.get("token").asText();
    }

    private void uploadPublicKey(String token) throws Exception {
        mockMvc.perform(put("/api/users/me/public-key")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"publicKey\":" + objectMapper.writeValueAsString(PUBLIC_KEY) + "}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.publicKeyConfigured").value(true));
    }
}
