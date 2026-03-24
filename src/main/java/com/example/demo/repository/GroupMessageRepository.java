package com.example.demo.repository;

import com.example.demo.entity.Group;
import com.example.demo.entity.GroupMessage;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface GroupMessageRepository extends JpaRepository<GroupMessage, Long> {

    @Query("""
            select gm from GroupMessage gm
            where gm.group = :group
            order by gm.createdAt asc
            """)
    List<GroupMessage> findByGroupOrderByCreatedAtAsc(@Param("group") Group group);

    @Query("""
            select gm from GroupMessage gm
            where gm.group = :group
            order by gm.createdAt desc
            """)
    List<GroupMessage> findByGroupOrderByCreatedAtDesc(@Param("group") Group group);
}
