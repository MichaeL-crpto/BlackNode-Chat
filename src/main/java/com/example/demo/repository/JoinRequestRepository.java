package com.example.demo.repository;

import com.example.demo.entity.Group;
import com.example.demo.entity.JoinRequest;
import com.example.demo.entity.UserAccount;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface JoinRequestRepository extends JpaRepository<JoinRequest, Long> {

    @Query("""
            select jr from JoinRequest jr
            where jr.group = :group and jr.user = :user and jr.status = 'PENDING'
            """)
    Optional<JoinRequest> findPendingRequest(@Param("group") Group group, @Param("user") UserAccount user);

    @Query("""
            select jr from JoinRequest jr
            where jr.group = :group and jr.status = 'PENDING'
            order by jr.createdAt asc
            """)
    List<JoinRequest> findPendingByGroup(@Param("group") Group group);

    @Query("""
            select jr from JoinRequest jr
            where jr.user = :user and jr.status = 'PENDING'
            order by jr.createdAt asc
            """)
    List<JoinRequest> findPendingByUser(@Param("user") UserAccount user);
}
