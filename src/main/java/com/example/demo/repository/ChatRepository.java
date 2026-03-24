package com.example.demo.repository;

import com.example.demo.entity.Chat;
import com.example.demo.entity.UserAccount;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ChatRepository extends JpaRepository<Chat, Long> {

    @Query("""
            select c from Chat c
            where (c.participantOne = :first and c.participantTwo = :second)
               or (c.participantOne = :second and c.participantTwo = :first)
            """)
    Optional<Chat> findBetweenUsers(@Param("first") UserAccount first, @Param("second") UserAccount second);

    @Query("""
            select c from Chat c
            where c.participantOne = :user or c.participantTwo = :user
            order by c.createdAt desc
            """)
    List<Chat> findAllForUser(@Param("user") UserAccount user);
}
