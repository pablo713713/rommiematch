package com.rommie.backend.domain.user;

import jakarta.persistence.*;
import java.util.List;

@Entity
@DiscriminatorValue("STUDENT")
public class Student extends AppUser {

    private String major;
    private Integer age;
    @Column(length = 1000)
    private String bio;

    @ElementCollection
    @CollectionTable(name = "student_hobby", joinColumns = @JoinColumn(name = "student_id"))
    @Column(name = "hobby")
    private List<String> hobbies;

    private String preferredLocation;
    private Integer budgetMin;
    private Integer budgetMax;

    // getters y setters
    public String getMajor() { return major; }
    public void setMajor(String major) { this.major = major; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public List<String> getHobbies() { return hobbies; }
    public void setHobbies(List<String> hobbies) { this.hobbies = hobbies; }
    public String getPreferredLocation() { return preferredLocation; }
    public void setPreferredLocation(String preferredLocation) { this.preferredLocation = preferredLocation; }
    public Integer getBudgetMin() { return budgetMin; }
    public void setBudgetMin(Integer budgetMin) { this.budgetMin = budgetMin; }
    public Integer getBudgetMax() { return budgetMax; }
    public void setBudgetMax(Integer budgetMax) { this.budgetMax = budgetMax; }
}
