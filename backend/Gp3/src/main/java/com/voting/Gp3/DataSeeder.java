package com.voting.Gp3;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.voting.Gp3.repository.CandidateRepository;

@Configuration
public class DataSeeder {

    @Bean
    @SuppressWarnings("unused")
    CommandLineRunner seedCandidates(CandidateRepository candidateRepository) {
        return args -> {
            if (candidateRepository.count() == 0) {
                candidateRepository.saveAll(java.util.List.of(
                    new Candidate(1, "King", "Male", "King", 20, "Computer Science", "Singing", "Warm and confident leader.", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e", 120),
                    new Candidate(2, "Queen", "Female", "Queen", 19, "Business Admin", "Dancing", "Creative and kind-hearted student leader.", "https://images.unsplash.com/photo-1494790108377-be9c29b29330", 118),
                    new Candidate(3, "Style", "Female", "Style", 21, "Mass Communication", "Fashion", "Always elegant and full of flair.", "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f", 96),
                    new Candidate(4, "Smart", "Male", "Smart", 22, "Engineering", "Public Speaking", "Analytical and very disciplined.", "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d", 88),
                    new Candidate(5, "Mr. Popular", "Male", "Mr. Popular", 20, "Tourism", "Comedy", "Always social and loved by everyone.", "https://images.unsplash.com/photo-1504593811423-6dd665756598", 142),
                    new Candidate(6, "Ms. Popular", "Female", "Ms. Popular", 20, "Psychology", "Performing Arts", "Energetic, friendly, and highly admired.", "https://images.unsplash.com/photo-1544005313-94ddf0286df2", 134)
                ));
            }
        };
    }
}
