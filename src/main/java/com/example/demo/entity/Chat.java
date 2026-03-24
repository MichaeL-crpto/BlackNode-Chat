package com.example.demo.entity;

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
@Table(name = "chats")
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "participant_one_id")
    private UserAccount participantOne;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "participant_two_id")
    private UserAccount participantTwo;

    private Instant createdAt;

    public Long getId() {
        return id;
    }

    public UserAccount getParticipantOne() {
        return participantOne;
    }

    public void setParticipantOne(UserAccount participantOne) {
        this.participantOne = participantOne;
    }

    public UserAccount getParticipantTwo() {
        return participantTwo;
    }

    public void setParticipantTwo(UserAccount participantTwo) {
        this.participantTwo = participantTwo;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
