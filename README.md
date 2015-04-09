# Tacademy Node.js 게시판 구현(Express, ejs, MySQL)

! MVC 패턴을 이용한 구현
  M - models 폴더


! 프로토콜 정의
  글쓰기 화면  : get /board/write
  글쓰기 : post /board/write

  리스트 : get /board/list/:page

  수정 화면 : get /board/modify
  수정하기 : post /board/modify

  삭제 화면 : get /board/delete
  삭제하기 : post /board/delete

  글 한개 보여주기 : get /board/read
