package com.example.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "chat_messages")
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "chat_id")
    private Chat chat;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "sender_id")
    private UserAccount sender;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "recipient_id")
    private UserAccount recipient;

    @Column(nullable = false, length = 8192)
    private String cipherText;

    @Column(nullable = false)
    private String initializationVector;

    @Column(nullable = false, length = 4096)
    private String senderEncryptedAesKey;

    @Column(nullable = false, length = 4096)
    private String recipientEncryptedAesKey;

    @Column(nullable = false)
    private String algorithm;

    @Column(nullable = false)
    private Instant createdAt;

    public Long getId() {
        return id;
    }

    public Chat getChat() {
        return chat;
    }

    public void setChat(Chat chat) {
        this.chat = chat;
    }

    public UserAccount getSender() {
        return sender;
    }

    public void setSender(UserAccount sender) {
        this.sender = sender;
    }

    public UserAccount getRecipient() {
        return recipient;
    }

    public void setRecipient(UserAccount recipient) {
        this.recipient = recipient;
    }

    public String getCipherText() {
        return cipherText;
    }

    public void setCipherText(String cipherText) {
        this.cipherText = cipherText;
    }

    public String getInitializationVector() {
        return initializationVector;
    }

    public void setInitializationVector(String initializationVector) {
        this.initializationVector = initializationVector;
    }

    public String getSenderEncryptedAesKey() {
        return senderEncryptedAesKey;
    }

    public void setSenderEncryptedAesKey(String senderEncryptedAesKey) {
        this.senderEncryptedAesKey = senderEncryptedAesKey;
    }

    public String getRecipientEncryptedAesKey() {
        return recipientEncryptedAesKey;
    }

    public void setRecipientEncryptedAesKey(String recipientEncryptedAesKey) {
        this.recipientEncryptedAesKey = recipientEncryptedAesKey;
    }

    public String getAlgorithm() {
        return algorithm;
    }

    public void setAlgorithm(String algorithm) {
        this.algorithm = algorithm;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
