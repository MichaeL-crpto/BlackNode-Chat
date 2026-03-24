package com.example.demo.service;

import com.example.demo.exception.BadRequestException;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.SecureRandom;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import org.springframework.stereotype.Service;

@Service
public class CryptoService {

    private static final String AES_TRANSFORMATION = "AES/GCM/NoPadding";
    private static final String RSA_TRANSFORMATION = "RSA/ECB/OAEPWithSHA-256AndMGF1Padding";
    private static final int GCM_TAG_LENGTH = 128;
    private static final int GCM_IV_LENGTH = 12;

    public EncryptedMessage encryptForParticipants(String plainText, String senderPublicKey, String recipientPublicKey) {
        try {
            SecretKey aesKey = generateAesKey();
            byte[] iv = new byte[GCM_IV_LENGTH];
            SecureRandom.getInstanceStrong().nextBytes(iv);

            Cipher aesCipher = Cipher.getInstance(AES_TRANSFORMATION);
            aesCipher.init(Cipher.ENCRYPT_MODE, aesKey, new GCMParameterSpec(GCM_TAG_LENGTH, iv));
            byte[] cipherBytes = aesCipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));

            PublicKey senderKey = parsePublicKey(senderPublicKey);
            PublicKey recipientKey = parsePublicKey(recipientPublicKey);

            return new EncryptedMessage(
                    Base64.getEncoder().encodeToString(cipherBytes),
                    Base64.getEncoder().encodeToString(iv),
                    wrapKey(aesKey, senderKey),
                    wrapKey(aesKey, recipientKey),
                    AES_TRANSFORMATION + " + " + RSA_TRANSFORMATION
            );
        } catch (GeneralSecurityException ex) {
            throw new BadRequestException("Unable to encrypt message with the provided RSA public keys");
        }
    }

    public EncryptedMessage encryptForGroup(String plainText, String senderPublicKey) {
        try {
            SecretKey aesKey = generateAesKey();
            byte[] iv = new byte[GCM_IV_LENGTH];
            SecureRandom.getInstanceStrong().nextBytes(iv);

            Cipher aesCipher = Cipher.getInstance(AES_TRANSFORMATION);
            aesCipher.init(Cipher.ENCRYPT_MODE, aesKey, new GCMParameterSpec(GCM_TAG_LENGTH, iv));
            byte[] cipherBytes = aesCipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));

            PublicKey senderKey = parsePublicKey(senderPublicKey);

            return new EncryptedMessage(
                    Base64.getEncoder().encodeToString(cipherBytes),
                    Base64.getEncoder().encodeToString(iv),
                    wrapKey(aesKey, senderKey),
                    null,
                    AES_TRANSFORMATION + " + " + RSA_TRANSFORMATION
            );
        } catch (GeneralSecurityException ex) {
            throw new BadRequestException("Unable to encrypt message with the provided RSA public key");
        }
    }

    private SecretKey generateAesKey() throws GeneralSecurityException {
        KeyGenerator generator = KeyGenerator.getInstance("AES");
        generator.init(256);
        return generator.generateKey();
    }

    private String wrapKey(SecretKey secretKey, PublicKey publicKey) throws GeneralSecurityException {
        Cipher rsaCipher = Cipher.getInstance(RSA_TRANSFORMATION);
        rsaCipher.init(Cipher.ENCRYPT_MODE, publicKey);
        return Base64.getEncoder().encodeToString(rsaCipher.doFinal(secretKey.getEncoded()));
    }

    private PublicKey parsePublicKey(String key) throws GeneralSecurityException {
        String sanitized = key
                .replace("-----BEGIN PUBLIC KEY-----", "")
                .replace("-----END PUBLIC KEY-----", "")
                .replaceAll("\\s+", "");
        byte[] bytes = Base64.getDecoder().decode(sanitized);
        X509EncodedKeySpec spec = new X509EncodedKeySpec(bytes);
        return KeyFactory.getInstance("RSA").generatePublic(spec);
    }

    public void validateRsaPublicKey(String publicKey) {
        try {
            parsePublicKey(publicKey);
        } catch (GeneralSecurityException ex) {
            throw new BadRequestException("Invalid RSA public key format");
        }
    }

    public record EncryptedMessage(
            String cipherText,
            String initializationVector,
            String senderEncryptedAesKey,
            String recipientEncryptedAesKey,
            String algorithm
    ) {
    }
}
