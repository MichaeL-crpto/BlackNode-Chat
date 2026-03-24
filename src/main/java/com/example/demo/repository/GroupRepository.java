package com.example.demo.repository;

import com.example.demo.entity.Group;
import com.example.demo.entity.GroupType;
import com.example.demo.entity.UserAccount;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface GroupRepository extends JpaRepository<Group, Long> {

    boolean existsByNameIgnoreCase(String name);

    Optional<Group> findByNameIgnoreCase(String name);

    @Query("""
            select distinct g from Group g
            left join g.members member
            where g.type = :publicType or member = :user
            order by g.createdAt desc
            """)
    List<Group> findAccessibleGroups(@Param("user") UserAccount user, @Param("publicType") GroupType publicType);
}
