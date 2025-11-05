package com.rommie.backend.repo;

import com.rommie.backend.domain.message.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    // buzón de entrada
    List<Message> findByRecipientIdOrderByCreatedAtDesc(Long recipientId);

    // mensajes enviados (opcional, lo usaremos luego si queremos)
    List<Message> findBySenderIdOrderByCreatedAtDesc(Long senderId);
}
