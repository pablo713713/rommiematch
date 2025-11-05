package com.rommie.backend.web;

import com.rommie.backend.domain.message.Message;
import com.rommie.backend.domain.listing.Listing;
import com.rommie.backend.domain.user.AppUser;
import com.rommie.backend.repo.MessageRepository;
import com.rommie.backend.repo.AppUserRepository;
import com.rommie.backend.repo.ListingRepository;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:4200")
public class MessageController {

    private final MessageRepository messageRepo;
    private final AppUserRepository userRepo;
    private final ListingRepository listingRepo;

    public MessageController(
            MessageRepository messageRepo,
            AppUserRepository userRepo,
            ListingRepository listingRepo
    ) {
        this.messageRepo = messageRepo;
        this.userRepo = userRepo;
        this.listingRepo = listingRepo;
    }

    // DTO para crear mensaje
    public static class MessageRequest {
        public Long senderId;
        public Long recipientId;
        public Long listingId;   // opcional
        public String content;
    }

    // DTO para devolver mensajes
    public static class MessageResponse {
        public Long id;
        public String content;
        public String createdAt;
        public boolean read;

        public Long senderId;
        public String senderName;
        public String senderRole;

        public Long recipientId;

        public Long listingId;
        public String listingTitle;
    }

    // Enviar mensaje
    @PostMapping
    public MessageResponse send(@RequestBody MessageRequest req) {
        if (req.senderId == null || req.recipientId == null || req.content == null || req.content.isBlank()) {
            throw new IllegalArgumentException("senderId, recipientId y content son obligatorios");
        }

        AppUser sender = userRepo.findById(req.senderId).orElseThrow();
        AppUser recipient = userRepo.findById(req.recipientId).orElseThrow();

        Listing listing = null;
        if (req.listingId != null) {
            listing = listingRepo.findById(req.listingId).orElse(null);
        }

        Message m = new Message();
        m.setSender(sender);
        m.setRecipient(recipient);
        m.setListing(listing);
        m.setContent(req.content);
        // createdAt y readFlag se manejan en @PrePersist / default

        Message saved = messageRepo.save(m);
        return toResponse(saved);
    }

    // Bandeja de entrada de un usuario
    @GetMapping("/inbox/{userId}")
    public List<MessageResponse> inbox(@PathVariable Long userId) {
        return messageRepo.findByRecipientIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // (Opcional) mensajes enviados por un usuario
    @GetMapping("/sent/{userId}")
    public List<MessageResponse> sent(@PathVariable Long userId) {
        return messageRepo.findBySenderIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private MessageResponse toResponse(Message m) {
        MessageResponse dto = new MessageResponse();
        dto.id = m.getId();
        dto.content = m.getContent();
        dto.createdAt = m.getCreatedAt() != null
                ? m.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                : null;
        dto.read = m.isReadFlag();

        AppUser sender = m.getSender();
        dto.senderId = sender.getId();
        dto.senderName = sender.getFullName() != null ? sender.getFullName() : sender.getEmail();
        dto.senderRole = sender.getRole();

        AppUser recipient = m.getRecipient();
        dto.recipientId = recipient.getId();

        Listing listing = m.getListing();
        if (listing != null) {
            dto.listingId = listing.getId();
            dto.listingTitle = listing.getTitle();
        }

        return dto;
    }
}
