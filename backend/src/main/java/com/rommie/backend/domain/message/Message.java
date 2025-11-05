package com.rommie.backend.domain.message;

import com.rommie.backend.domain.user.AppUser;
import com.rommie.backend.domain.listing.Listing; // ajusta el paquete si tu Listing está en otro

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "message")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // remitente
    @ManyToOne(optional = false)
    @JoinColumn(name = "sender_id")
    private AppUser sender;

    // destinatario
    @ManyToOne(optional = false)
    @JoinColumn(name = "recipient_id")
    private AppUser recipient;

    // opcional: departamento/listing sobre el que se habla
    @ManyToOne
    @JoinColumn(name = "listing_id")
    private Listing listing;

    @Column(nullable = false, length = 1000)
    private String content;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private boolean readFlag = false;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    // getters y setters

    public Long getId() { return id; }

    public AppUser getSender() { return sender; }
    public void setSender(AppUser sender) { this.sender = sender; }

    public AppUser getRecipient() { return recipient; }
    public void setRecipient(AppUser recipient) { this.recipient = recipient; }

    public Listing getListing() { return listing; }
    public void setListing(Listing listing) { this.listing = listing; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public boolean isReadFlag() { return readFlag; }
    public void setReadFlag(boolean readFlag) { this.readFlag = readFlag; }
}
