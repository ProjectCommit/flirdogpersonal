package access.service;

import java.util.List;
import java.util.Optional;

import access.bean.JoinRequestDTO;
import jakarta.servlet.http.HttpSession;
import matching.bean.MatchingDTO;
import user.bean.DogsInfo;
import user.bean.User;

public interface AccessService {

	Optional<User> login(String email, String passwd);

	Optional<User> findId(Long id);

	List<DogsInfo> getFiveDogsInfo();

	void processJoin(JoinRequestDTO joinRequest, HttpSession session);

	boolean checkEmailExist(String email);

	void saveDogScore(String dogsId, String score);

	void updatePwd(String email, String passwd);

	Optional<User> getUserInfoAsDogId(String dogId);

	Optional<MatchingDTO> getMatchingTable(String dogName, String userId);

}
