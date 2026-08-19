package com.voting.Gp3.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

import org.springframework.core.io.PathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.voting.Gp3.Candidate;
import com.voting.Gp3.repository.CandidateRepository;
import com.voting.Gp3.service.ImageStorageService;

@RestController
@RequestMapping("/api")
public class CandidateController {

    private final CandidateRepository candidateRepository;
    private final ImageStorageService imageStorageService;

    public CandidateController(CandidateRepository candidateRepository, ImageStorageService imageStorageService) {
        this.candidateRepository = candidateRepository;
        this.imageStorageService = imageStorageService;
    }

    private List<String> getCategoriesForGender(String gender) {
        if ("Male".equalsIgnoreCase(gender)) {
            return List.of("King", "Smart", "Mr. Popular");
        }

        if ("Female".equalsIgnoreCase(gender)) {
            return List.of("Queen", "Style", "Ms. Popular");
        }

        return List.of();
    }

    private String saveCandidateImageIfNeeded(String imageValue) {
        if (imageValue == null || imageValue.isBlank()) {
            return null;
        }

        String savedImage = imageStorageService.storeImageFromDataUrl(imageValue);
        return savedImage == null ? imageValue : savedImage;
    }

    @GetMapping("/candidates")
    public List<Candidate> getCandidates() {
        return candidateRepository.findAll();
    }

    @GetMapping({"/candidates_images/{filename}", "/api/candidates_images/{filename}"})
    public ResponseEntity<Resource> getCandidateImage(@PathVariable String filename) throws IOException {
        Path imageRoot = Path.of("candidates_images").toAbsolutePath().normalize();
        Path imagePath = imageRoot.resolve(filename).normalize();

        if (!imagePath.startsWith(imageRoot) || !Files.exists(imagePath)) {
            return ResponseEntity.notFound().build();
        }

        String contentType = Files.probeContentType(imagePath);
        if (contentType == null) {
            contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }

        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(contentType))
            .header(HttpHeaders.CACHE_CONTROL, "max-age=3600")
            .body(new PathResource(imagePath));
    }

    @PostMapping("/candidates")
    public ResponseEntity<?> createCandidate(@RequestBody Candidate candidate) {
        if (candidate.getName() == null || candidate.getName().isBlank()) {
            return ResponseEntity.badRequest().body("Candidate name is required.");
        }

        String gender = candidate.getGender();
        List<String> categories = getCategoriesForGender(gender);
        if (categories.isEmpty()) {
            return ResponseEntity.badRequest().body("Gender must be Male or Female.");
        }

        String storedPhoto = saveCandidateImageIfNeeded(candidate.getPhoto());

        List<Candidate> savedCandidates = new ArrayList<>();
        for (String category : categories) {
            Candidate categoryCandidate = new Candidate();
            categoryCandidate.setNo(candidate.getNo());
            categoryCandidate.setName(candidate.getName());
            categoryCandidate.setGender(gender);
            categoryCandidate.setCategory(category);
            categoryCandidate.setAge(candidate.getAge());
            categoryCandidate.setMajor(candidate.getMajor());
            categoryCandidate.setTalent(candidate.getTalent());
            categoryCandidate.setBio(candidate.getBio());
            categoryCandidate.setPhoto(storedPhoto);
            Integer candidateVotes = candidate.getVotes();
            categoryCandidate.setVotes(candidateVotes == null ? 0 : candidateVotes);
            savedCandidates.add(candidateRepository.save(categoryCandidate));
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(savedCandidates);
    }

    @PutMapping("/candidates/{id}")
    @Transactional
    public ResponseEntity<?> updateCandidate(@PathVariable Long id, @RequestBody Candidate candidate) {
        return candidateRepository.findById(id)
            .map(existingCandidate -> {
                List<Candidate> relatedCandidates = candidateRepository.findByNameAndNoAndGender(
                    existingCandidate.getName(),
                    existingCandidate.getNo(),
                    existingCandidate.getGender()
                );

                if (relatedCandidates.isEmpty()) {
                    relatedCandidates = List.of(existingCandidate);
                }

                String incomingPhoto = candidate.getPhoto();
                String storedPhoto = saveCandidateImageIfNeeded(incomingPhoto);
                if (storedPhoto != null && !storedPhoto.equals(existingCandidate.getPhoto()) && existingCandidate.getPhoto() != null 
                        && !existingCandidate.getPhoto().startsWith("http") && existingCandidate.getPhoto().contains("candidates_images/")) {
                    imageStorageService.deleteImage(existingCandidate.getPhoto());
                }

                for (Candidate relatedCandidate : relatedCandidates) {
                    relatedCandidate.setNo(candidate.getNo());
                    relatedCandidate.setName(candidate.getName());
                    relatedCandidate.setGender(candidate.getGender());
                    relatedCandidate.setAge(candidate.getAge());
                    relatedCandidate.setMajor(candidate.getMajor());
                    relatedCandidate.setTalent(candidate.getTalent());
                    relatedCandidate.setBio(candidate.getBio());
                    relatedCandidate.setPhoto(storedPhoto != null ? storedPhoto : relatedCandidate.getPhoto());
                    if (candidate.getVotes() != null) {
                        relatedCandidate.setVotes(candidate.getVotes());
                    }
                }

                candidateRepository.saveAll(relatedCandidates);
                return ResponseEntity.ok(relatedCandidates);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/candidates/{id}")
    public ResponseEntity<Void> deleteCandidate(@PathVariable Long id) {
        if (!candidateRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        Candidate candidate = candidateRepository.findById(id).orElse(null);
        if (candidate != null && candidate.getPhoto() != null && candidate.getPhoto().contains("candidates_images/")) {
            imageStorageService.deleteImage(candidate.getPhoto());
        }

        candidateRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
