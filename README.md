## Local Tunnel

```bash
npx localtunnel --port 3000 --subdomain soogeun 
```

## 실행 안 되는 에러

현재 노드 버전이 `10.24.1`로 설정되어 있어서 nest 앱을 실행하기 위한 최소 버전인 12 버전보다 낮기 때문에 실행이 되지 않습니다.

새로운 터미널을 실행하고 아래의 명령어를 실행하면 제대로 작동됩니다.

```bash
$ nvm install 14.15.1  # Node Version Upgrade
$ yarn start:dev
```

---

## Error: doesn't execute Nest App

Current node version is `10.24.1`, which is below than 12 ver (min version to running Nest app).

Try this command. Then it works !

```bash
$ nvm install 14.15.1  # upgrade Node Version
$ yarn install
$ yarn start:dev
```

.

---

.

# 해야할 것
* Class Validator로 유효성 검사 (podcasts)
* User Entity의 eager 옵션을 없애고 query를 추가하기 (성능 개선)
* getPodcasts 의 리턴 값이 시간 순서가 아님..?
* podcasts service file refectoring (파일 분리 혹은 클래스 분리)
* Get Podcasts 코드 리팩토링하기 (All, Search, My)
* get podcasts by hash tags 에서 중복 데이터 담길 수 있는 케이스 핸들링
* update Podcast에서 해시태그를 지우거나 추가할 수 있도록 하기

# Today's Objects
'Listener'를 위한 Resolver를 작성할 차례입니다.

```
* searchPodcasts (by title)     [O]
* reviewPodcast                 [O]
* subscribeToPodcast            [O]
* seeSubscriptions              [O]
* markEpisodeAsPlayed           [O]
  (like a Netflix movie that has been watched)
```


---

## Assignment log

### 5.12.
유저 인증과 유저 CRUD

호스트(Host) 역할의 유저는 Podcast를 만들어서 Episode를 업로드 /
리스너(Listener) 유저들이 팟캐스트를 구독하여 에피소드를 듣기

`users` module with entities, services and resolvers

```
- Users should be able to login with a password.
- There should be only oneuser entity 
- but your entity should support two roles 'Host' and 'Listener'.
- Create Guards to protect private resolvers.
- Use JWT as authentication method.
- Create a decorator to get the logged in user.
```

Resolver에 들어갈 Mutation & Quary
```
- createAccount [o]
- login         [o]
- editProfile   [o]
- seeProfile    [o]
```

패스워드는 반드시 bcrypt를 이용하여 hash화 /
EditProfile에서 패스워드를 변경할 경우 꼭 다시 hashing을 해야 

JwtModule을 만들어서 구현하시면 보너스 점수
