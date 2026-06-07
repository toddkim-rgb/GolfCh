import { useState, useEffect, useRef } from "react";
import { supabase, APP_DATA_TABLE } from "./supabaseClient";

// ─── Seed Data ────────────────────────────────────────────────────────────────
const INIT_PLAYERS = [
  { id:"p1", name:"전정은", gender:"F" },
  { id:"p2", name:"왕석균", gender:"M" },
  { id:"p3", name:"김석현", gender:"M" },
  { id:"p4", name:"천성민", gender:"M" },
];
const INIT_COURSES = [
  { id:"c1", name:"노스팜",      region:"경기 여주시", difficulty:3 },
  { id:"c2", name:"티클라우드",  region:"경기 용인시", difficulty:3 },
  { id:"c3", name:"베르힐 영종", region:"인천 중구",   difficulty:4 },
  { id:"c4", name:"센추리21",    region:"경기 이천시", difficulty:3 },
  { id:"c5", name:"세일",        region:"경기 양주시", difficulty:3 },
  { id:"c6", name:"드림파크",    region:"서울 강서구", difficulty:4 },
  { id:"c7", name:"자유로",      region:"경기 고양시", difficulty:3 },
  { id:"c8", name:"인천그랜드",  region:"인천 서구",   difficulty:4 },
  { id:"ec001", name:"360도", region:"경기 여주시", difficulty:3 },
  { id:"ec002", name:"JNJ", region:"전남 장흥군", difficulty:3 },
  { id:"ec003", name:"가덕", region:"부산 강서구", difficulty:3 },
  { id:"ec004", name:"가야", region:"경남 김해시", difficulty:3 },
  { id:"ec005", name:"가평베네스트", region:"경기 가평군", difficulty:3 },
  { id:"ec006", name:"강남300", region:"경기 광주시", difficulty:3 },
  { id:"ec007", name:"거제뷰", region:"경남 거제시", difficulty:3 },
  { id:"ec008", name:"경주신라", region:"경북 경주시", difficulty:3 },
  { id:"ec009", name:"고령유니밸리", region:"경북 고령군", difficulty:3 },
  { id:"ec010", name:"고성", region:"경남 고성군", difficulty:3 },
  { id:"ec011", name:"고창", region:"전북 고창군", difficulty:3 },
  { id:"ec012", name:"곤지암", region:"경기 광주시", difficulty:3 },
  { id:"ec013", name:"골드", region:"경기 용인시", difficulty:3 },
  { id:"ec014", name:"골드레이크", region:"전남 나주시", difficulty:3 },
  { id:"ec015", name:"골드베이", region:"충남 태안군", difficulty:3 },
  { id:"ec016", name:"광릉", region:"경기 남양주시", difficulty:3 },
  { id:"ec017", name:"광주", region:"전남 곡성군", difficulty:3 },
  { id:"ec018", name:"구미", region:"경북 구미시", difficulty:3 },
  { id:"ec019", name:"군산", region:"전북 군산시", difficulty:3 },
  { id:"ec020", name:"군위", region:"경북 군위군", difficulty:3 },
  { id:"ec021", name:"그랜드", region:"충북 청주시", difficulty:3 },
  { id:"ec022", name:"그린힐", region:"경기 광주시", difficulty:3 },
  { id:"ec023", name:"금강", region:"경기 여주시", difficulty:3 },
  { id:"ec024", name:"기흥", region:"경기 화성시", difficulty:3 },
  { id:"ec025", name:"김제", region:"전북 김제시", difficulty:3 },
  { id:"ec026", name:"나인브릿지", region:"제주 서귀포시", difficulty:3 },
  { id:"ec027", name:"남부", region:"경기 용인시", difficulty:3 },
  { id:"ec028", name:"남서울", region:"경기 성남시", difficulty:3 },
  { id:"ec029", name:"남촌", region:"경기 광주시", difficulty:3 },
  { id:"ec030", name:"남춘천", region:"강원 춘천시", difficulty:3 },
  { id:"ec031", name:"내장산", region:"전북 정읍시", difficulty:3 },
  { id:"ec032", name:"노벨", region:"경남 고성군", difficulty:3 },
  { id:"ec033", name:"뉴서울", region:"경기 광주시", difficulty:3 },
  { id:"ec034", name:"뉴스프링빌", region:"경기 이천시", difficulty:3 },
  { id:"ec035", name:"뉴코리아", region:"경기 고양시", difficulty:3 },
  { id:"ec036", name:"다이아몬드", region:"경남 양산시", difficulty:3 },
  { id:"ec037", name:"담양레이나", region:"전남 담양군", difficulty:3 },
  { id:"ec038", name:"대구", region:"경북 경산시", difficulty:3 },
  { id:"ec039", name:"대영베이스", region:"충북 충주시", difficulty:3 },
  { id:"ec040", name:"대영힐스", region:"충북 충주시", difficulty:3 },
  { id:"ec041", name:"더리얼", region:"강원 원주시", difficulty:3 },
  { id:"ec042", name:"더스타휴", region:"경기 양평군", difficulty:3 },
  { id:"ec043", name:"더클래식", region:"제주 제주시", difficulty:3 },
  { id:"ec044", name:"더포그레이스", region:"제주 제주시", difficulty:3 },
  { id:"ec045", name:"더플레이어스", region:"강원 춘천시", difficulty:3 },
  { id:"ec046", name:"더헤븐", region:"경기 안산시", difficulty:3 },
  { id:"ec047", name:"데니스", region:"경기 파주시", difficulty:3 },
  { id:"ec048", name:"델피노", region:"강원 고성군", difficulty:3 },
  { id:"ec049", name:"동래베네스트", region:"부산 금정구", difficulty:3 },
  { id:"ec050", name:"동부산", region:"경남 양산시", difficulty:3 },
  { id:"ec051", name:"동서울", region:"경기 성남시", difficulty:3 },
  { id:"ec052", name:"동촌", region:"충북 충주시", difficulty:3 },
  { id:"ec053", name:"드비치", region:"경남 거제시", difficulty:3 },
  { id:"ec054", name:"떼제베", region:"충북 청주시", difficulty:3 },
  { id:"ec055", name:"라데나", region:"강원 춘천시", difficulty:3 },
  { id:"ec056", name:"라비돌", region:"경기 화성시", difficulty:3 },
  { id:"ec057", name:"라비에벨", region:"강원 춘천시", difficulty:3 },
  { id:"ec058", name:"라싸", region:"경기 포천시", difficulty:3 },
  { id:"ec059", name:"라온", region:"제주 제주시", difficulty:3 },
  { id:"ec060", name:"락가든", region:"경기 포천시", difficulty:3 },
  { id:"ec061", name:"레이크사이드", region:"경기 용인시", difficulty:3 },
  { id:"ec062", name:"레이크우드", region:"경기 양주시", difficulty:3 },
  { id:"ec063", name:"레이크힐스 제주", region:"제주 서귀포시", difficulty:3 },
  { id:"ec064", name:"레인보우힐스", region:"충북 음성군", difficulty:3 },
  { id:"ec065", name:"렉스필드", region:"경기 여주시", difficulty:3 },
  { id:"ec066", name:"로드힐스", region:"강원 춘천시", difficulty:3 },
  { id:"ec067", name:"로얄포레", region:"충북 충주시", difficulty:3 },
  { id:"ec068", name:"롯데스카이힐 제주", region:"제주 서귀포시", difficulty:3 },
  { id:"ec069", name:"리베라", region:"경기 화성시", difficulty:3 },
  { id:"ec070", name:"마론뉴데이", region:"충남 천안시", difficulty:3 },
  { id:"ec071", name:"마에스트로", region:"경기 안성시", difficulty:3 },
  { id:"ec072", name:"마우나오션", region:"경북 경주시", difficulty:3 },
  { id:"ec073", name:"마이다스밸리", region:"경기 가평군", difficulty:3 },
  { id:"ec074", name:"메이플비치", region:"강원 강릉시", difficulty:3 },
  { id:"ec075", name:"몽베르", region:"경기 포천시", difficulty:3 },
  { id:"ec076", name:"무주덕유산", region:"전북 무주군", difficulty:3 },
  { id:"ec077", name:"무주안성", region:"전북 안성면", difficulty:3 },
  { id:"ec078", name:"발리오스", region:"경기 화성시", difficulty:3 },
  { id:"ec079", name:"버드우드", region:"충남 천안시", difficulty:3 },
  { id:"ec080", name:"베어즈베스트 청라", region:"인천 서구", difficulty:3 },
  { id:"ec081", name:"베어크리크", region:"경기 포천시", difficulty:3 },
  { id:"ec082", name:"베어크리크 춘천", region:"강원 춘천시", difficulty:3 },
  { id:"ec083", name:"베어크리크포천", region:"경기 포천시", difficulty:3 },
  { id:"ec084", name:"베어포트", region:"전북 익산시", difficulty:3 },
  { id:"ec085", name:"베이사이드", region:"부산 기장군", difficulty:3 },
  { id:"ec086", name:"벨라스톤", region:"강원 횡성군", difficulty:3 },
  { id:"ec087", name:"보라", region:"울산 울주군", difficulty:3 },
  { id:"ec088", name:"보성", region:"전남 보성군", difficulty:3 },
  { id:"ec089", name:"부영", region:"제주 서귀포시", difficulty:3 },
  { id:"ec090", name:"블랙밸리", region:"강원 삼척시", difficulty:3 },
  { id:"ec091", name:"블랙스톤 제주", region:"제주 제주시", difficulty:3 },
  { id:"ec092", name:"블루원 디아너스", region:"경북 경주시", difficulty:3 },
  { id:"ec093", name:"블루원 상주", region:"경북 상주시", difficulty:3 },
  { id:"ec094", name:"블루원 용인", region:"경기 용인시", difficulty:3 },
  { id:"ec095", name:"블루헤런", region:"경기 여주시", difficulty:3 },
  { id:"ec096", name:"비발디파크", region:"강원 홍천군", difficulty:3 },
  { id:"ec097", name:"비에이비스타", region:"경기 이천시", difficulty:3 },
  { id:"ec098", name:"빅토리아", region:"경기 여주시", difficulty:3 },
  { id:"ec099", name:"사이프러스", region:"제주 제주시", difficulty:3 },
  { id:"ec100", name:"상떼힐", region:"전북 익산시", difficulty:3 },
  { id:"ec101", name:"샌드파인", region:"강원 강릉시", difficulty:3 },
  { id:"ec102", name:"샤인데일", region:"강원 홍천군", difficulty:3 },
  { id:"ec103", name:"샤인빌", region:"제주 서귀포시", difficulty:3 },
  { id:"ec104", name:"샴발라", region:"경기 포천시", difficulty:3 },
  { id:"ec105", name:"서경타니", region:"경남 진주시", difficulty:3 },
  { id:"ec106", name:"서라벌", region:"경북 경주시", difficulty:3 },
  { id:"ec107", name:"서서울", region:"경기 파주시", difficulty:3 },
  { id:"ec108", name:"서원밸리", region:"경기 파주시", difficulty:3 },
  { id:"ec109", name:"서원힐스", region:"경기 파주시", difficulty:3 },
  { id:"ec110", name:"석정힐", region:"전북 고창군", difficulty:3 },
  { id:"ec111", name:"설악썬밸리", region:"강원 고성군", difficulty:3 },
  { id:"ec112", name:"세라지오", region:"경기 여주시", difficulty:3 },
  { id:"ec113", name:"세이지우드 홍천", region:"강원 홍천군", difficulty:3 },
  { id:"ec114", name:"세인트포", region:"제주 제주시", difficulty:3 },
  { id:"ec115", name:"세종에머슨", region:"세종 전의면", difficulty:3 },
  { id:"ec116", name:"세종필드", region:"세종시", difficulty:3 },
  { id:"ec117", name:"센추리21", region:"강원 원주시", difficulty:3 },
  { id:"ec118", name:"솔라고", region:"충남 태안군", difficulty:3 },
  { id:"ec119", name:"솔모로", region:"경기 여주시", difficulty:3 },
  { id:"ec120", name:"솔트베이", region:"경기 시흥시", difficulty:3 },
  { id:"ec121", name:"송추", region:"경기 양주시", difficulty:3 },
  { id:"ec122", name:"수원", region:"경기 용인시", difficulty:3 },
  { id:"ec123", name:"순천", region:"전남 순천시", difficulty:3 },
  { id:"ec124", name:"스마트쿠", region:"경기 용인시", difficulty:3 },
  { id:"ec125", name:"스카이72", region:"인천 중구", difficulty:3 },
  { id:"ec126", name:"스카이밸리", region:"경기 여주시", difficulty:3 },
  { id:"ec127", name:"스카이뷰", region:"경남 함양군", difficulty:3 },
  { id:"ec128", name:"스카이힐 제주", region:"제주 서귀포시", difficulty:3 },
  { id:"ec129", name:"스톤게이트", region:"부산 기장군", difficulty:3 },
  { id:"ec130", name:"스톤비치", region:"충남 태안군", difficulty:3 },
  { id:"ec131", name:"스프링베일", region:"강원 춘천시", difficulty:3 },
  { id:"ec132", name:"승주", region:"전남 순천시", difficulty:3 },
  { id:"ec133", name:"시그너스", region:"충북 충주시", difficulty:3 },
  { id:"ec134", name:"신안", region:"경기 안성시", difficulty:3 },
  { id:"ec135", name:"신원월드", region:"경기 용인시", difficulty:3 },
  { id:"ec136", name:"실크리버", region:"충북 청주시", difficulty:3 },
  { id:"ec137", name:"써미트", region:"전북 진안군", difficulty:3 },
  { id:"ec138", name:"썬밸리", region:"충북 음성군", difficulty:3 },
  { id:"ec139", name:"아난티클럽서울", region:"경기 가평군", difficulty:3 },
  { id:"ec140", name:"아덴힐", region:"제주 제주시", difficulty:3 },
  { id:"ec141", name:"아라미르", region:"경남 창원시", difficulty:3 },
  { id:"ec142", name:"아름다운", region:"충남 아산시", difficulty:3 },
  { id:"ec143", name:"아리솔", region:"충북 보은군", difficulty:3 },
  { id:"ec144", name:"아리지", region:"경기 여주시", difficulty:3 },
  { id:"ec145", name:"아시아나", region:"경기 용인시", difficulty:3 },
  { id:"ec146", name:"아시아드", region:"부산 기장군", difficulty:3 },
  { id:"ec147", name:"안성", region:"경기 안성시", difficulty:3 },
  { id:"ec148", name:"안양CC", region:"경기 군포시", difficulty:3 },
  { id:"ec149", name:"알펜시아", region:"강원 평창군", difficulty:3 },
  { id:"ec150", name:"양산", region:"경남 양산시", difficulty:3 },
  { id:"ec151", name:"양주", region:"경기 양주시", difficulty:3 },
  { id:"ec152", name:"양평TPC", region:"경기 양평군", difficulty:3 },
  { id:"ec153", name:"어등산", region:"광주 광산구", difficulty:3 },
  { id:"ec154", name:"에덴블루", region:"경기 안성시", difficulty:3 },
  { id:"ec155", name:"에딘버러", region:"충남 금산군", difficulty:3 },
  { id:"ec156", name:"에머슨", region:"충북 진천군", difficulty:3 },
  { id:"ec157", name:"에버리스", region:"제주 제주시", difficulty:3 },
  { id:"ec158", name:"에이원", region:"경남 양산시", difficulty:3 },
  { id:"ec159", name:"에이치원", region:"충북 이천시", difficulty:3 },
  { id:"ec160", name:"엘리시안 강촌", region:"강원 춘천시", difficulty:3 },
  { id:"ec161", name:"엘리시안 제주", region:"제주 제주시", difficulty:3 },
  { id:"ec162", name:"여수경도", region:"전남 여수시", difficulty:3 },
  { id:"ec163", name:"여주", region:"경기 여주시", difficulty:3 },
  { id:"ec164", name:"여주신라", region:"경기 여주시", difficulty:3 },
  { id:"ec165", name:"여주포레스트", region:"경기 여주시", difficulty:3 },
  { id:"ec166", name:"영광", region:"전남 영광군", difficulty:3 },
  { id:"ec167", name:"영암", region:"전남 영암군", difficulty:3 },
  { id:"ec168", name:"오너스", region:"강원 춘천시", difficulty:3 },
  { id:"ec169", name:"오라", region:"제주 제주시", difficulty:3 },
  { id:"ec170", name:"오렌지듄스", region:"인천 연수구", difficulty:3 },
  { id:"ec171", name:"오션뷰", region:"경북 영덕군", difficulty:3 },
  { id:"ec172", name:"오션힐스영덕", region:"경북 영덕군", difficulty:3 },
  { id:"ec173", name:"오션힐스청도", region:"경북 청도군", difficulty:3 },
  { id:"ec174", name:"오션힐스포항", region:"경북 포항시", difficulty:3 },
  { id:"ec175", name:"오크밸리", region:"강원 원주시", difficulty:3 },
  { id:"ec176", name:"오크힐스", region:"강원 원주시", difficulty:3 },
  { id:"ec177", name:"옥스필드", region:"강원 횡성군", difficulty:3 },
  { id:"ec178", name:"올데이", region:"충북 충주시", difficulty:3 },
  { id:"ec179", name:"용원", region:"경남 창원시", difficulty:3 },
  { id:"ec180", name:"용평", region:"강원 평창군", difficulty:3 },
  { id:"ec181", name:"우리들", region:"제주 서귀포시", difficulty:3 },
  { id:"ec182", name:"우정힐스", region:"충남 천안시", difficulty:3 },
  { id:"ec183", name:"울산", region:"울산 울주군", difficulty:3 },
  { id:"ec184", name:"웰리힐리", region:"강원 횡성군", difficulty:3 },
  { id:"ec185", name:"웰링턴", region:"경기 이천시", difficulty:3 },
  { id:"ec186", name:"윈체스트", region:"경기 안성시", difficulty:3 },
  { id:"ec187", name:"이븐데일", region:"충북 청주시", difficulty:3 },
  { id:"ec188", name:"이스트밸리", region:"경기 광주시", difficulty:3 },
  { id:"ec189", name:"이포", region:"경기 여주시", difficulty:3 },
  { id:"ec190", name:"익산", region:"전북 익산시", difficulty:3 },
  { id:"ec191", name:"인천국제", region:"인천 서구", difficulty:3 },
  { id:"ec192", name:"인터불고", region:"경북 경산시", difficulty:3 },
  { id:"ec193", name:"인터불고 원주", region:"강원 원주시", difficulty:3 },
  { id:"ec194", name:"일동레이크", region:"경기 포천시", difficulty:3 },
  { id:"ec195", name:"임페리얼팰리스", region:"충북 충주시", difficulty:3 },
  { id:"ec196", name:"자유CC", region:"경기 여주시", difficulty:3 },
  { id:"ec197", name:"장수", region:"전북 장수군", difficulty:3 },
  { id:"ec198", name:"잭니클라우드", region:"인천 연수구", difficulty:3 },
  { id:"ec199", name:"전주", region:"전북 완주군", difficulty:3 },
  { id:"ec200", name:"정산", region:"경남 김해시", difficulty:3 },
  { id:"ec201", name:"제일", region:"경기 안산시", difficulty:3 },
  { id:"ec202", name:"제주CC", region:"제주 제주시", difficulty:3 },
  { id:"ec203", name:"젠스필드", region:"충북 음성군", difficulty:3 },
  { id:"ec204", name:"중원", region:"충북 충주시", difficulty:3 },
  { id:"ec205", name:"지산", region:"경기 용인시", difficulty:3 },
  { id:"ec206", name:"진양밸리", region:"충북 음성군", difficulty:3 },
  { id:"ec207", name:"진주", region:"경남 진주시", difficulty:3 },
  { id:"ec208", name:"진천밸리", region:"충북 진천군", difficulty:3 },
  { id:"ec209", name:"참밸리", region:"경기 포천시", difficulty:3 },
  { id:"ec210", name:"창원", region:"경남 창원시", difficulty:3 },
  { id:"ec211", name:"처인", region:"경기 용인시", difficulty:3 },
  { id:"ec212", name:"천안상록", region:"충남 천안시", difficulty:3 },
  { id:"ec213", name:"청주", region:"충북 청주시", difficulty:3 },
  { id:"ec214", name:"캐슬렉스", region:"경기 하남시", difficulty:3 },
  { id:"ec215", name:"캐슬렉스 제주", region:"제주 서귀포시", difficulty:3 },
  { id:"ec216", name:"캐슬파인", region:"경기 여주시", difficulty:3 },
  { id:"ec217", name:"코리아", region:"경기 용인시", difficulty:3 },
  { id:"ec218", name:"코스카", region:"충북 음성군", difficulty:3 },
  { id:"ec219", name:"크라운", region:"제주 제주시", difficulty:3 },
  { id:"ec220", name:"클럽디보은", region:"충북 보은군", difficulty:3 },
  { id:"ec221", name:"클럽디속리산", region:"충북 보은군", difficulty:3 },
  { id:"ec222", name:"킹즈락", region:"충북 제천시", difficulty:3 },
  { id:"ec223", name:"타이거CC", region:"경기 파주시", difficulty:3 },
  { id:"ec224", name:"태광", region:"경기 용인시", difficulty:3 },
  { id:"ec225", name:"태인", region:"전북 정읍시", difficulty:3 },
  { id:"ec226", name:"테디밸리", region:"제주 서귀포시", difficulty:3 },
  { id:"ec227", name:"통도파인이스트", region:"경남 양산시", difficulty:3 },
  { id:"ec228", name:"트리니티", region:"경기 여주시", difficulty:3 },
  { id:"ec229", name:"티클라우드", region:"경기 동두천시", difficulty:3 },
  { id:"ec230", name:"파가니카", region:"강원 춘천시", difficulty:3 },
  { id:"ec231", name:"파미르", region:"경북 칠곡군", difficulty:3 },
  { id:"ec232", name:"파인리즈", region:"강원 고성군", difficulty:3 },
  { id:"ec233", name:"파인밸리", region:"강원 삼척시", difficulty:3 },
  { id:"ec234", name:"파인비치", region:"전남 해남군", difficulty:3 },
  { id:"ec235", name:"파인스톤", region:"충남 당진시", difficulty:3 },
  { id:"ec236", name:"파인크리크", region:"경기 안성시", difficulty:3 },
  { id:"ec237", name:"팔공", region:"대구 동구", difficulty:3 },
  { id:"ec238", name:"페럼클럽", region:"경기 여주시", difficulty:3 },
  { id:"ec239", name:"포라이즌", region:"전남 순천시", difficulty:3 },
  { id:"ec240", name:"포천", region:"경기 포천시", difficulty:3 },
  { id:"ec241", name:"포천아도니스", region:"경기 포천시", difficulty:3 },
  { id:"ec242", name:"포천힐스", region:"경기 포천시", difficulty:3 },
  { id:"ec243", name:"푸른솔GC", region:"경기 포천시", difficulty:3 },
  { id:"ec244", name:"프리스틴밸리", region:"경기 가평군", difficulty:3 },
  { id:"ec245", name:"프린세스", region:"충남 공주시", difficulty:3 },
  { id:"ec246", name:"플라자 용인", region:"경기 용인시", difficulty:3 },
  { id:"ec247", name:"플라자 제주", region:"제주 제주시", difficulty:3 },
  { id:"ec248", name:"핀크스", region:"제주 서귀포시", difficulty:3 },
  { id:"ec249", name:"필로스", region:"경기 포천시", difficulty:3 },
  { id:"ec250", name:"하이스트", region:"경남 강서구", difficulty:3 },
  { id:"ec251", name:"한성", region:"경기 용인시", difficulty:3 },
  { id:"ec252", name:"한양", region:"경기 고양시", difficulty:3 },
  { id:"ec253", name:"함평엘리체", region:"전남 함평군", difficulty:3 },
  { id:"ec254", name:"해비치 제주", region:"제주 제주시", difficulty:3 },
  { id:"ec255", name:"해슬리나인브릿지", region:"경기 여주시", difficulty:3 },
  { id:"ec256", name:"해운대", region:"부산 기장군", difficulty:3 },
  { id:"ec257", name:"해운대비치", region:"부산 기장군", difficulty:3 },
  { id:"ec258", name:"현대더링스", region:"충남 태안군", difficulty:3 },
  { id:"ec259", name:"화산", region:"경기 용인시", difficulty:3 },
  { id:"ec260", name:"휘닉스스프링스", region:"경기 이천시", difficulty:3 },
  { id:"ec261", name:"휘닉스파크", region:"강원 평창군", difficulty:3 },
  { id:"ec262", name:"히든밸리", region:"충북 진천군", difficulty:3 },
  { id:"ec263", name:"힐데스하임", region:"충북 제천시", difficulty:3 },
  { id:"ec264", name:"센테리움cc", region:"충청", difficulty:3 }
];
const INIT_HANDICAPS = {
  2025:{ p1:93, p2:90, p3:93, p4:97 },
  2026:{ p1:94, p2:93, p3:92, p4:100 },
};
const INIT_ROUNDS = [
  { id:"r1", courseId:"c1", date:"2025-04-26", weather:"SUNNY", memo:"",
    scores:[{pid:"p1",score:96,birdies:0},{pid:"p2",score:95,birdies:0},{pid:"p3",score:94,birdies:0},{pid:"p4",score:102,birdies:0}]},
  { id:"r2", courseId:"c2", date:"2025-05-30", weather:"CLOUDY", memo:"",
    scores:[{pid:"p1",score:96,birdies:0},{pid:"p2",score:99,birdies:0},{pid:"p3",score:93,birdies:0},{pid:"p4",score:106,birdies:0}]},
  { id:"r3", courseId:"c3", date:"2025-06-28", weather:"SUNNY", memo:"",
    scores:[{pid:"p1",score:95,birdies:0},{pid:"p2",score:86,birdies:1},{pid:"p3",score:90,birdies:1},{pid:"p4",score:97,birdies:0}]},
  { id:"r4", courseId:"c4", date:"2025-07-25", weather:"SUNNY", memo:"",
    scores:[{pid:"p1",score:91,birdies:0},{pid:"p2",score:95,birdies:0},{pid:"p3",score:92,birdies:0},{pid:"p4",score:105,birdies:0}]},
  { id:"r5", courseId:"c4", date:"2025-07-26", weather:"WINDY", memo:"",
    scores:[{pid:"p1",score:95,birdies:0},{pid:"p2",score:95,birdies:0},{pid:"p3",score:92,birdies:1},{pid:"p4",score:98,birdies:0}]},
  { id:"r6", courseId:"c5", date:"2025-08-30", weather:"SUNNY", memo:"",
    scores:[{pid:"p1",score:90,birdies:0},{pid:"p2",score:93,birdies:0},{pid:"p3",score:92,birdies:0},{pid:"p4",score:103,birdies:0}]},
  { id:"r7", courseId:"c6", date:"2025-09-27", weather:"CLOUDY", memo:"",
    scores:[{pid:"p1",score:95,birdies:0},{pid:"p2",score:94,birdies:0},{pid:"p3",score:93,birdies:0},{pid:"p4",score:90,birdies:2}]},
  { id:"r8", courseId:"c7", date:"2026-03-28", weather:"SUNNY", memo:"",
    scores:[{pid:"p1",score:91,birdies:0},{pid:"p2",score:91,birdies:0},{pid:"p3",score:97,birdies:0},{pid:"p4",score:100,birdies:0}]},
  { id:"r9", courseId:"c8", date:"2026-05-09", weather:"SUNNY", memo:"",
    scores:[{pid:"p1",score:91,birdies:0},{pid:"p2",score:84,birdies:1},{pid:"p3",score:87,birdies:0},{pid:"p4",score:92,birdies:1}]},
];

// ─── Theme ────────────────────────────────────────────────────────────────────
const C = {
  bg:"#f0f4ff", surface:"#ffffff", border:"#e2e8f0",
  text:"#1e293b", muted:"#64748b", faint:"#94a3b8",
  blue:"#3b5bdb", purple:"#7048e8", cyan:"#0891b2",
  pink:"#e91e8c", green:"#059669", gold:"#d97706",
  red:"#dc2626", yellow:"#fef08a", yellowBg:"#fefce8",
};
const WEATHER_MAP = { SUNNY:"☀️ 맑음", CLOUDY:"⛅ 흐림", RAINY:"🌧️ 비", WINDY:"💨 바람" };
const uid = () => Math.random().toString(36).slice(2,9);

// ─── Character Images ────────────────────────────────────────────────────────
const CHAR_IMGS = {
  p1: "data:image/webp;base64,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",
  p2: "data:image/webp;base64,UklGRrgPAABXRUJQVlA4IKwPAADwOwCdASp4AHgAPlEgjkQjoiEVzC3YOAUEsgBlWRu/jusa3f3H8jPbCs/+Y/qn6s5mM8HbV/B9DfqV/PfsAfqr0ovMB+xv7b+9f6Iv9V6iP9S/w/Wcegf5answ/up+4Xtl3gt+U8M/E56L9wuXJEj+T/bn85/Xv3P/tHt53l/HD+x9QL8e/k/9+/L/z5dkHab0AvYD6P/mPzF/qXOx9i/YA/VH/c/ml/TvZ0/1Xi++Xfrv8AH82/q//K/xf5FfGb/uf5H/Gfth7Yvzj+8f9X/Ef4v9lvsH/lH9I/1v93/e//Kf/////cz7C/2u9lT9dkQVe6rHiN/3ISFyNPPBtwiKVF2WvYt55gNLbIGJd+gieS7vtqnB3BeVwWOEEHrBcwg93kj6HJlaGOBmP3lMEm29mVFqNAAZkPt54qlpHEGrTI4EyRj6hWSqGAgb9CAQoTPHclM0a0ht3tIR7NIg1Qspw9xQz77I+eBh4RpppZh25M6CtMFaZhgNIRnWBuh2EtY8j1LNYLo6ndtHKvBQxv3gV9//RbVvtDabcnwt4Iv/ti3G7PfNni9r/XZo+zCzsSd6JC1nZX2nQ2u8eBZ5wgnVk/8VsFyPb7MG+cRIxe6dUFvVQF9dwr7iRVyiH+GPxfMlLxlsYZ8sgAD+8sp/nkmhLamP/bkHqq3rkG0y+YnQGoJDJAOcnQC1zKcU7m4dGqFmMKY5oVOiuBJe2SxqmpX/QliAKUajK2P5X3ZTmQ3w03d2bA/dj+2QrR/Z9elLOzlkSyxSmr89J1sXx/5vGrjlbK2nLPHyqmneLergVEK7I8pZIm8Y4iS3fs0Qc/ehgnKVDxu6tE+1M6xuagCKEUw426ZM4/ffgQshx++VCRax+at51TlF6ZlSoZ31fLgr6Ayq9A7+GxoDAU2qU+opqadVUnZKNFKcORcCq4f0id2TYPF8L+WnBSIqEBGVR+JduCnRdlPxG9U4utjuTLFFi01ip2hQroNnGZo0BbLTosCZ0nQjE8Y5PRgPjilFzXEcZIzzMSJlDl7aGGNRlKmAGYSyIqItw44ntSiA90rx9uwt41i1V+dvBolatdlCj6P2YtV9AsCC8fFPJkgnFETlt+onIxA0cUNAuOnopgFX90npvlf7EHx/vy0t3z9hymRRPCPOw4D4P1LE67pILnXzLuiSiZ9fTP/CxGz2kS+EyuNFJ0noqPEih3t30qw5iTKN+geK15vfDO7h0PR/ZnPUZ8SVH5x88MO9bOxbbYplMdlVxOi8//5saZlgoJr9uiI/l6OreWzcd9txgmTb6i5sLW/AqMW53vTG+ptsE1iCNv8ovfGsrIwVwoQnjQrww50UsTZ9IsZ5SaQNxauEs5MicgSVdP0/4+DNdPM5JuAyb0Jcp0fpD8QtbvL5463zvCUr6bDA7co+sLwQxrPeoQIfg8hZQCXMJ4k1kZ29UAuKmm1VM5ObH848SZggkxCeQmrkExV9+GsKE02IkvC9UBWLtlm844XHhHp42G7M9aXHbo9mRv6gZ/JPqja8/HwJxokY/0++VLcwP9IHjJ0K/6yjrxj/+QTWLHHKo6tpr9XS86rP4S6g8CXtgQxAtA4St1QwLkpI9pHF0PuBBxEK26nBLPGLQAiVnY2uv6cxVoPR0XoT6u3J22uc8+bPK93eGXl008hb1bULGTeoxyC4qLkm5FNzSI8hUjOtRiC/6jOlowQlDBs1vtckVP8ZvjnEqrHVrAjDh0KHNAQiMlstlTe/YKCNhwzJoOCjYh7e03lk/toH/FdQ701P3YvtZHau1iNVP/8uramgp2j1+YAk/aJhVIXAgkyul5lC/rGil1gqwyc+afxXMUGas7yMkMAEamV/shmDCkZncdcsxVWDxg6QxNb9dtN+bkpo8Zt6LVi2OtQxpRwNu381OIAZSAPVdhWl/77wNFzWJBXWHW4DTTpLxqQRhmrmmBXeh15jB4k/u6ITJT1KnE5wLKvbDn0bXTVGVsTFwE3pImZ1cQGUDTrudPkv25UgBh/SKcGCYQejrtG0Qd/Wc02RQmd4WTAaT3/npZzS1w3rNQUf5Qgvtzf5IA6IikPLLQAJzDzKYABRITlNj32qWNMjQmJZDrF332v41ACKtM9wrRWApIL28z36K0XpusVkn6ptzbspit9967FhtFGR8ZkPKwClJ8fNsR9pXHLtGzGNiqir9bUjvQl0SR4akGDU27DQ2OeNI+REdQoOx3a8lIeLJ7uaDjU7J0HzJtnQONIdxYfMcILn/FA3SkQki0WH5De0Tj0Sm5gprV+3Q+UB5Ho+uv2OLK+kn5MolRk8HII4cAbo8kx5qWkd3agE7cimSJdgPJm2wHXlfnMv7aDz+HlfMfXxwlXWMEfB8q0VwkTRcqv7/fgRabBhNfo2pJGd7owo2t/4h5rHfrhDnkz3cbq1qfZhJwLFGQnfAK6P/a4+ZcjWYJrdYWOwB40SASanrjYL3+X1Y0lmR8kGR5+W7NHI/rGnmU2nP+kW/VyyM9vbLPoctrfX79PmnCvEhdLkMaN9k8UUDsb+TNao5UQPphKpA+K3D/9VzPUxQPSUTzvWEtd2fqw3gSOOd5iu7XYxKb+VQ+Qf5Af6dhjpQFDfUGj7m0axz8wlfWQpjyEjKy6riZyzG7XgEEi9RP8bKZEyO6gOll78yYkJig52vbkp/cGBtzaxOm5lbDpwDdCpaIFJJ/u/L6Dzbloj1bJRcaBDLbKS4H+ggSj16s0t5QKiQAZirD4eEdtuE36kNv4AghPmnkbDJlJvirvwHrKjIBrVJd+p/azQCER3k9sUdhyaLiTGsccXTJep5tHw/sRzEQ/KswpzGe283g8OMAOjxjobUHu5Scl6vRdJUITnDg3Zi1zrIVAnm052VJGsm/RFN7T7aqk5l80odhJ37oERtljf52xRNnheAn0MPf+xZDGkeUsnHuz4kvd9zRYPQxyyT4FSRr+ttooIQhxwrXJUNvdoYZ8kJNbrQ+oRuoGoY7n6Vm4rMObz+sDvFSwXgsBNTPOhj7dW4nMjZ1pklFahEPoix0a1YJ9pr1KIFomZERTyK52A9XQpksNYVj8v1nyGmyG3SoaJ+RngNdatpYlHQqZlXUWu0eHTxU8O2HHOYqhG/g9qbyZqgWC+Djb+cTOeL+45UDK4n8hBbEEqRdKAg1wp69ezvly4IL47DxAQiPBJp/iCjoNmNST+0qz8AioXuThg3Y7RI/6O5eAHiWScXy5o3WP27GwITDFrc5PINKps+QW1GfDM4z3+9J2XSdxKR36SjoFZ0pTjbzpmQWzUdgQsggqu3+xM0Aqa8iep8ZCNQgkMhZ1f/IZriWQBDh01q2pVkn0QD9Rt0PnmVIWFkMHRLUAZkjrDsrW8B/u50nzPf1EN3SocTAWKTL26HqcFdw7RGR/n9oskMGNZSfVKDbA3NcN8mrMpqLpKSRY0JfzbGYTlqYJfFau1HnHY1G0jTaHdXs8+JHbPF2CYceT4rJ6Xkj0t1M5dfdL8/RXDdr9DlQAzfqR1nrHgF+5gVTtutKLQQMCP0/1VHLKwmq9sTpGbx51uN71QGpy2/4YAv3Ie7DrDHlJWBvoNi0mJVVzIvFv1xvUXyJTrLJlkgJ0qQOt4Lhe9349GRns/JE2HXYUJ/Qb3AZQgK6UiD+zUCI2tRn5cgztvz8wSViUX2ImGBX7KCrr0DDcTBFzNvtqBvSL4sWv17QNdsTu5/3Ovw0AOUT6qPNc2pH1AoEu9cPKIXg/6Q2OIUgHXfG9Cuj6oEvF4TvcEtWAWyGG9E/y8fCKuDrJvBuzWSEqLFto4668NhtGDwPosqdIw1jNBpEkNF7blQthCeUvPf92Tnp4KxtSB8W8/KQLuFFDxs74zhATTJJ9kDctAtYzpN56HyqT4JgL9m8cT3vlldBgcafyit1SlslxYfHCOvW+nKvsewcItnhEQseLybXHF0knGI//3PIsKFGt37k8PvxMma36UFkd1C8XGGFmG2WNAGUZq9P4PGLGn6VoAOKu8nbWAHx6vaSn1xFLMeBQU19dyNI6t6ON/b+8Gml7FGNH4eZuLxgsCaDx3Nk746UTgulljgUkJFgjXJEthwR5EkhO5YZlp8pGZATFzoI6tamsbIpGyl4UYA7+4X83pu18ctWhFmLIrAoU7nfJoyypehqb88lTMnXdtfK+1RuLL+DN6VJNfGbEzAT3XZFm/zMGwKO1BKzaHL/MO35bGt7caZRg36ktlW9wgWWPmJ4XbJKCUIvH7CkFmy7V1qOsPHtcq6+CEOcXa+yBnw3GHb3XfIh2E9kM0JCIclfAy+ubWcnSb7Gx5BZwY1pqQJP0Ds6XX0cBYnPGt1Ea4ejh87t9szobLejemhGMH83sHM/5+RS9wxiQl6ES765clo9rJIeNUSV+ZzuGTF3rC8ems8GyRDrT8vkW3Xi7gvzc79jO6GeIbbApIiHc4+dQNOpjg2VLUkJfUkThjouSGisIPMmZszVmaNoYYQVLNZE15G1PW8oRbbsZf8yeyB+JHpyDSflWpa+FT5yXDJv3yx6zTR7yDZQWJpy2uiW1DuSG6dXDqiVKpHQk9HvXZ2f73NQvQbaE4Eo8KQDGxp3y6AosT6Ix/9gKhRU8JFoB+jte3wtgk/gqmQ7ykrzi7eL/gf+EQAKC1kvKHC9W6e+ZAb2FqVXd9KZEUQbVHg37d7LZTGjyHaP7UJp/p4oyWsq5sVQYWACwCjKQC+5ICIG7bctNQpCEsCuOYX9iSMootNmB7x0e36ZVfJj39DmZztHOcAIxZMdEOdTlxk0XXGPoCOEIzKo6qBfGkyoLI6qXhz+1CRJwIfTbUsRim9U5k39wiL7rNFhNF9C4OIewXrnS+DO02OA0HJwsOnRua/SPFmm8xMFgKEggOcbdZHTXaF9D1Ipam3JiTrWnet2kmT2MICsF8Xzm2A2OfdIbHqFn1WqL2lBd0OgJr5XCOGbMo2RqFEkTeLEBKGL6IIsS94inGZsUMaWh7AnfApDsUvRwXeZQDBJ8agq6XpCXiNQzhM8ULaDPFo1FNNSWv6SkfZkFimw3LLlM8DVRcLZX3du9fHw3MbmkZC/rUxAAAMzgDAqfXpwi7JGrT+EphHFjvVf4dOqu67qWgmpCBaeDDgaSQJYrN9+cUBhdyCrjykHLYdAkDvUHCa6J3y/+OD9Z7cDwnamKtWqRLdI4jbX6VcO9tpy8n1WdQnPJhR9x1SANWN39n//1c62DH76qY9QUoH7gUA0cWmVrWFtrrD2q7N/oPE0zLePf4f+JSjhRuCmGkqQyUUzXjQ9G2QGA34ebvT9E5HgGC5d8vVvcDyAEUwclj7HOQD01eRMFS1vmhj0ESfAy4nAayWGLNSgAA",
  p3: "data:image/webp;base64,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",
  p4: "data:image/webp;base64,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",
};
const CharJJ  = () => <img src={CHAR_IMGS.p1} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>;
const CharWSK = () => <img src={CHAR_IMGS.p2} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>;
const CharKSH = () => <img src={CHAR_IMGS.p3} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>;
const CharCSM = () => <img src={CHAR_IMGS.p4} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>;
const CHARS   = { p1:CharJJ, p2:CharWSK, p3:CharKSH, p4:CharCSM };
const ACCENTS = { p1:C.blue, p2:C.purple, p3:C.green, p4:C.gold };

// ─── Butterfly Icon ───────────────────────────────────────────────────────────
const Butterfly = ({size=14}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
    style={{display:"inline",verticalAlign:"middle"}}>
    <ellipse cx="30" cy="35" rx="24" ry="16" transform="rotate(-35 30 35)" fill="#f0436b"/>
    <ellipse cx="68" cy="42" rx="22" ry="13" transform="rotate(-20 68 42)" fill="#f4708a" opacity="0.9"/>
    <ellipse cx="34" cy="65" rx="18" ry="12" transform="rotate(15 34 65)" fill="#f7a0b4" opacity="0.85"/>
    <ellipse cx="62" cy="70" rx="16" ry="11" transform="rotate(-10 62 70)" fill="#f7b8c5" opacity="0.8"/>
    <path d="M47 40 Q49 55 50 75" stroke="#1a1a1a" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
    <ellipse cx="48.5" cy="42" rx="3" ry="4.5" fill="#1a1a1a"/>
    <path d="M47 39 C43 32 38 27 35 23" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    <circle cx="34.5" cy="22.5" r="2" fill="#1a1a1a"/>
    <path d="M50 38 C52 31 56 27 59 23" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    <circle cx="59.5" cy="22.5" r="2" fill="#1a1a1a"/>
  </svg>
);

// ─── Stats ────────────────────────────────────────────────────────────────────
function computeStats(players, rounds, handicaps, year) {
  return (players||[]).map(p => {
    const hcp = handicaps[year]?.[p.id] ?? null;
    const sc  = rounds.flatMap(r => r.scores.filter(s => s.pid === p.id));
    const vals = sc.map(s => s.score);
    const best = vals.length ? Math.min(...vals) : null;
    const avgScore = vals.length ? +(vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(1) : null;
    const birdies  = sc.reduce((a,s)=>a+s.birdies,0);
    const belowHcp = hcp ? vals.filter(v=>v<hcp).length : 0;
    const hcpDiff  = (hcp&&avgScore!==null) ? +(avgScore-hcp).toFixed(1) : null;
    return {...p, hcp, avgScore, best, birdies, belowHcp, hcpDiff, roundCount:vals.length};
  });
}
function computeAwards(stats) {
  const a = (stats||[]).filter(s=>s.roundCount>0);
  if (!a.length) return null;
  const maxB=Math.max(...a.map(s=>s.birdies));
  const minBest=Math.min(...a.map(s=>s.best??999));
  const minDiff=Math.min(...a.map(s=>s.hcpDiff??999));
  const maxBelow=Math.max(...a.map(s=>s.belowHcp));
  return {
    birdie:   a.filter(s=>s.birdies===maxB),
    best:     a.filter(s=>s.best===minBest),
    improved: a.filter(s=>s.hcpDiff===minDiff),
    challenge:a.filter(s=>s.belowHcp===maxBelow),
  };
}
const champScore = s => (s.hcpDiff??999)*2 - (s.birdies??0);

// ─── Storage Hook ─────────────────────────────────────────────────────────────
// 클라우드 DB(Supabase) 동기화 훅 — 모든 기기에서 동일한 데이터를 실시간으로 공유
// app_data 테이블(key text PK, value jsonb)에 저장하고, 변경 시 다른 기기로 실시간 전파
// localStorage는 오프라인 폴백 캐시로만 사용 (최초 1회 클라우드에 데이터 없으면 기존 로컬 데이터를 자동 이전)
function useStored(key, init) {
  const [val, setVal] = useState(init);
  const [ready, setReady] = useState(false);
  const lastSynced = useRef(null); // 마지막으로 동기화(송신/수신)된 값의 직렬화 문자열 — 에코/중복 방지

  useEffect(() => {
    let active = true;
    setReady(false);
    (async () => {
      let seed = init;
      try {
        const { data, error } = await supabase.from(APP_DATA_TABLE).select("value").eq("key", key).maybeSingle();
        if (!active) return;
        if (!error && data && data.value !== undefined && data.value !== null) {
          seed = data.value;
        } else {
          // 클라우드에 데이터가 없으면 기존 로컬 저장값을 1회 이전(마이그레이션)
          try {
            const raw = localStorage.getItem(key);
            if (raw !== null) seed = JSON.parse(raw);
          } catch (e) { /* ignore parse error */ }
          await supabase.from(APP_DATA_TABLE).upsert({ key, value: seed, updated_at: new Date().toISOString() });
        }
      } catch (e) {
        // 네트워크 오류 등 — 로컬 캐시로 폴백
        try {
          const raw = localStorage.getItem(key);
          if (raw !== null) seed = JSON.parse(raw);
        } catch (e2) { /* ignore */ }
      }
      if (!active) return;
      lastSynced.current = JSON.stringify(seed);
      setVal(seed);
      setReady(true);
    })();
    return () => { active = false; };
  }, [key]);

  // 다른 기기에서의 변경을 실시간으로 수신
  useEffect(() => {
    const channel = supabase
      .channel(`app_data_${key}`)
      .on("postgres_changes", { event: "*", schema: "public", table: APP_DATA_TABLE, filter: `key=eq.${key}` }, (payload) => {
        const incoming = payload.new && payload.new.value;
        if (incoming === undefined || incoming === null) return;
        const incomingStr = JSON.stringify(incoming);
        if (incomingStr === lastSynced.current) return; // 내가 보낸 변경의 에코 → 무시
        lastSynced.current = incomingStr;
        setVal(incoming);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [key]);

  // 로컬 변경을 클라우드로 전송 + 오프라인 폴백 캐시 갱신
  useEffect(() => {
    if (!ready) return;
    const str = JSON.stringify(val);
    if (str === lastSynced.current) return; // 이미 동기화된 값(초기 로드/원격 수신 echo) → 재전송 불필요
    lastSynced.current = str;
    supabase.from(APP_DATA_TABLE).upsert({ key, value: val, updated_at: new Date().toISOString() })
      .then(({ error }) => { if (error) console.error(`[${key}] 클라우드 저장 실패:`, error.message); });
    try { localStorage.setItem(key, str); } catch (e) { /* quota/serialize */ }
  }, [val, ready, key]);

  return [val, setVal, ready];
}

// ─── UI Atoms ─────────────────────────────────────────────────────────────────
const Stars = ({n, sz=14}) => (
  <span style={{color:C.gold,fontSize:sz,letterSpacing:0.5}}>
    {"★".repeat(n)}{"☆".repeat(5-n)}
  </span>
);
const Card = ({children,style={},onClick}) => (
  <div onClick={onClick} style={{background:C.surface,borderRadius:16,
    border:`1px solid ${C.border}`,boxShadow:"0 2px 12px rgba(0,0,0,0.06)",...style,
    cursor:onClick?"pointer":"default"}}>{children}</div>
);
const Chip = ({children,color=C.blue}) => (
  <span style={{fontSize:11,fontWeight:700,padding:"3px 9px",borderRadius:20,
    background:`${color}18`,color,border:`1px solid ${color}30`}}>{children}</span>
);
const Btn = ({children,onClick,color=C.blue,full=false,outline=false,small=false}) => (
  <button onClick={onClick} style={{background:outline?"transparent":color,
    border:outline?`1.5px solid ${color}`:"none",borderRadius:small?10:12,
    padding:small?"7px 14px":"11px 20px",color:outline?color:"#fff",
    fontWeight:700,fontSize:small?12:14,cursor:"pointer",width:full?"100%":"auto",
    fontFamily:"inherit"}}>
    {children}
  </button>
);
const FInput = ({label,...p}) => (
  <div style={{marginBottom:12}}>
    {label&&<div style={{fontSize:12,fontWeight:600,color:C.muted,marginBottom:4}}>{label}</div>}
    <input {...p} style={{width:"100%",background:C.bg,border:`1.5px solid ${C.border}`,
      borderRadius:10,padding:"10px 14px",color:C.text,fontSize:14,outline:"none",
      boxSizing:"border-box",fontFamily:"inherit",...p.style}}/>
  </div>
);
const FSel = ({label,options,...p}) => (
  <div style={{marginBottom:12}}>
    {label&&<div style={{fontSize:12,fontWeight:600,color:C.muted,marginBottom:4}}>{label}</div>}
    <select {...p} style={{width:"100%",background:C.bg,border:`1.5px solid ${C.border}`,
      borderRadius:10,padding:"10px 14px",color:C.text,fontSize:14,outline:"none",
      boxSizing:"border-box",fontFamily:"inherit"}}>
      {(options||[]).map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
  </div>
);
// 한글 자모 분해(초성/중성/종성) — 유사어(부분 자모) 검색 지원
const CHO=["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
const JUNG=["ㅏ","ㅐ","ㅑ","ㅒ","ㅓ","ㅔ","ㅕ","ㅖ","ㅗ","ㅘ","ㅙ","ㅚ","ㅛ","ㅜ","ㅝ","ㅞ","ㅟ","ㅠ","ㅡ","ㅢ","ㅣ"];
const JONG=["","ㄱ","ㄲ","ㄳ","ㄴ","ㄵ","ㄶ","ㄷ","ㄹ","ㄺ","ㄻ","ㄼ","ㄽ","ㄾ","ㄿ","ㅀ","ㅁ","ㅂ","ㅄ","ㅅ","ㅆ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
function decompose(str){
  let out="";
  for(const ch of str){
    const code=ch.charCodeAt(0)-0xAC00;
    if(code>=0&&code<=11171){
      const cho=Math.floor(code/588), jung=Math.floor((code%588)/28), jong=code%28;
      out+=CHO[cho]+JUNG[jung]+JONG[jong];
    } else out+=ch;
  }
  return out;
}
function fuzzyKor(target,query){
  if(!query) return true;
  const t=target.toLowerCase(), q=query.toLowerCase();
  if(t.includes(q)) return true;
  // 자모 분해 후 부분 문자열/부분 시퀀스 매칭 (초성 검색, 유사어 검색 지원)
  const dt=decompose(t), dq=decompose(q);
  if(dt.includes(dq)) return true;
  let qi=0;
  for(let i=0;i<dt.length&&qi<dq.length;i++) if(dt[i]===dq[qi]) qi++;
  return qi===dq.length;
}
// ─── CourseSearchInput: DB 골프장 리스트 검색 + 유사어(초성/자모) 검색 ─────────
function CourseSearchInput({label,courses,value,onChange,placeholder,nullable}) {
  const list=courses||[];
  const selected=list.find(c=>c.id===value);
  const [query,setQuery]=useState(selected?selected.name:"");
  const [open,setOpen]=useState(false);
  useEffect(()=>{
    const c=list.find(c=>c.id===value);
    setQuery(c?c.name:"");
  },[value]);
  const filtered=(query.trim()
    ? list.filter(c=>fuzzyKor(c.name,query)||fuzzyKor(c.region,query))
    : list
  ).slice(0,30);
  const pick=c=>{ setQuery(c?c.name:""); onChange(c?c.id:""); setOpen(false); };
  return (
    <div style={{marginBottom:12,position:"relative"}}>
      {label&&<div style={{fontSize:12,fontWeight:600,color:C.muted,marginBottom:4}}>{label}</div>}
      <input value={query}
        onChange={e=>{setQuery(e.target.value);setOpen(true);if(!e.target.value)onChange("");}}
        onFocus={()=>setOpen(true)}
        onBlur={()=>setTimeout(()=>setOpen(false),150)}
        placeholder={placeholder||"골프장 이름/지역 검색 (예: 노스, ㄴㅅ, 영종)"}
        style={{width:"100%",background:C.bg,border:`1.5px solid ${C.border}`,
          borderRadius:10,padding:"10px 14px",color:C.text,fontSize:14,outline:"none",
          boxSizing:"border-box",fontFamily:"inherit"}}/>
      {open&&(
        <div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:999,marginTop:4,
          background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:10,
          boxShadow:"0 8px 24px rgba(0,0,0,0.12)",maxHeight:240,overflowY:"auto"}}>
          {nullable&&(
            <div onMouseDown={()=>pick(null)}
              style={{padding:"10px 14px",cursor:"pointer",borderBottom:`1px solid ${C.border}`,
                fontSize:13,color:C.muted,fontStyle:"italic"}}>선택 안 함</div>
          )}
          {filtered.length>0?filtered.map(c=>(
            <div key={c.id} onMouseDown={()=>pick(c)}
              style={{padding:"10px 14px",cursor:"pointer",borderBottom:`1px solid ${C.border}`,
                fontSize:13,color:C.text,background:c.id===value?"#eef4ff":"#fff"}}>
              <span style={{fontWeight:700}}>{c.name}</span>
              <span style={{color:C.muted,fontSize:11,marginLeft:6}}>{c.region}</span>
            </div>
          )):(
            <div style={{padding:"12px 14px",fontSize:12,color:C.faint}}>검색 결과가 없습니다.</div>
          )}
        </div>
      )}
    </div>
  );
}
function Modal({title,onClose,children}) {
  return (
    <div style={{position:"fixed",inset:0,zIndex:100,display:"flex",alignItems:"center",
      justifyContent:"center",background:"rgba(15,23,42,0.45)"}}>
      <div style={{background:C.surface,borderRadius:20,width:"100%",maxWidth:420,margin:"0 16px",
        boxShadow:"0 20px 60px rgba(0,0,0,0.15)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"18px 20px",borderBottom:`1px solid ${C.border}`}}>
          <span style={{fontWeight:800,fontSize:16,color:C.text}}>{title}</span>
          <button onClick={onClose} style={{background:"none",border:"none",
            color:C.faint,fontSize:20,cursor:"pointer",lineHeight:1}}>✕</button>
        </div>
        <div style={{padding:20}}>{children}</div>
      </div>
    </div>
  );
}

// ─── Nav Icons ────────────────────────────────────────────────────────────────
const IconSeason = ({active,color}) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="12" width="4" height="9" rx="1.5" fill={active?color:"#cbd5e1"}/>
    <rect x="10" y="7" width="4" height="14" rx="1.5" fill={active?color:"#cbd5e1"}/>
    <rect x="17" y="3" width="4" height="18" rx="1.5" fill={active?color:"#e2e8f0"}/>
    <path d="M5 11 L12 6 L19 2" stroke={active?color:"#94a3b8"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconRounds = ({active,color}) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="15" cy="3.5" r="2" fill={active?color:"#94a3b8"}/>
    <path d="M15 5.5 L13 10 L9 13" stroke={active?color:"#94a3b8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13 10 L11 15 L9 20" stroke={active?color:"#94a3b8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13 10 L15 15 L17 19" stroke={active?color:"#94a3b8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 13 L3 9" stroke={active?color:"#94a3b8"} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="2.5" cy="8.5" r="1.3" fill={active?color:"#cbd5e1"}/>
    <path d="M2 21 L22 21" stroke={active?color:"#e2e8f0"} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconAwards = ({active,color}) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M7 3 H17 V13 C17 16.3 14.8 18 12 18 C9.2 18 7 16.3 7 13 Z" fill={active?color:"#cbd5e1"}/>
    <path d="M7 6 C4 6 3 8 3 10 C3 12 4.5 12.5 6 12" stroke={active?color:"#cbd5e1"} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    <path d="M17 6 C20 6 21 8 21 10 C21 12 19.5 12.5 18 12" stroke={active?color:"#cbd5e1"} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    <rect x="10.5" y="18" width="3" height="3" rx="0.5" fill={active?color:"#cbd5e1"}/>
    <rect x="8" y="21" width="8" height="1.5" rx="0.75" fill={active?color:"#cbd5e1"}/>
    <path d="M12 8 L12.6 9.8 H14.5 L13 10.9 L13.5 12.7 L12 11.6 L10.5 12.7 L11 10.9 L9.5 9.8 H11.4 Z" fill={active?"#fff":"#e2e8f0"}/>
  </svg>
);
const IconAdmin = ({active,color}) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M12 2 L13.5 4.5 L16.5 4 L17.5 6.8 L20 8 L19.5 11 L21.5 13 L20 15.5 L21 18 L18.2 18.8 L17 21 L14 20.5 L12 22 L10 20.5 L7 21 L5.8 18.8 L3 18 L4 15.5 L2.5 13 L4.5 11 L4 8 L6.5 6.8 L7.5 4 L10.5 4.5 Z" fill={active?color:"#cbd5e1"} opacity="0.9"/>
    <circle cx="12" cy="12" r="4" fill={active?"#fff":"#f8fafc"}/>
    <circle cx="12" cy="12" r="2.2" fill={active?color:"#94a3b8"}/>
  </svg>
);

// ─── PlayerCard ───────────────────────────────────────────────────────────────
function PlayerCard({stat,rank}) {
  const Char  = CHARS[stat.id];
  const acc   = ACCENTS[stat.id]??C.blue;
  const ranks = ["🥇","🥈","🥉","4️⃣"];
  return (
    <Card style={{overflow:"hidden",border:`1.5px solid ${acc}30`}}>
      <div style={{height:3,background:acc,borderRadius:"16px 16px 0 0"}}/>
      <div style={{padding:"10px 10px 8px"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:48,height:48,borderRadius:"50%",overflow:"hidden",flexShrink:0,
            border:`2.5px solid ${acc}`,background:C.bg}}>
            {Char&&<Char/>}
          </div>
          <div style={{minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:4}}>
              <span style={{fontSize:13}}>{ranks[rank]}</span>
              <span style={{fontWeight:800,fontSize:14,color:C.text,whiteSpace:"nowrap"}}>{stat.name}</span>
            </div>
            <div style={{display:"flex",gap:4,marginTop:3,flexWrap:"wrap"}}>
              <Chip color={acc}>핸디 {stat.hcp??"-"}</Chip>
              {stat.hcpDiff!==null&&stat.hcpDiff<0&&<Chip color={C.green}>향상 {stat.hcpDiff}</Chip>}
            </div>
          </div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",borderTop:`1px solid ${C.border}`}}>
        {[["평균",stat.avgScore??"-",C.text],["최저",stat.best??"-",acc],["버디",stat.birdies,C.red]].map(([l,v,c],i)=>(
          <div key={l} style={{padding:"7px 4px",textAlign:"center",borderRight:i<2?`1px solid ${C.border}`:"none"}}>
            <div style={{fontSize:9,color:C.faint,marginBottom:1}}>{l}</div>
            <div style={{fontFamily:"monospace",fontWeight:800,fontSize:16,color:c}}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",borderTop:`1px solid ${C.border}`}}>
        {[["핸디차이",stat.hcpDiff!==null?(stat.hcpDiff>0?"+":"")+stat.hcpDiff:"-",stat.hcpDiff!==null&&stat.hcpDiff<0?C.green:C.faint],
          ["핸디미만",stat.belowHcp+"회",C.pink]].map(([l,v,c])=>(
          <div key={l} style={{padding:"6px 4px",textAlign:"center"}}>
            <div style={{fontSize:9,color:C.faint,marginBottom:1}}>{l}</div>
            <div style={{fontFamily:"monospace",fontWeight:700,fontSize:12,color:c}}>{v}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── YearTabs ─────────────────────────────────────────────────────────────────
function YearTabs({year,years,onChange}) {
  return (
    <div style={{display:"flex",gap:8,marginBottom:16}}>
      {years.map(y=>(
        <button key={y} onClick={()=>onChange(y)} style={{padding:"7px 20px",borderRadius:30,
          border:"none",cursor:"pointer",fontWeight:700,fontSize:13,fontFamily:"inherit",
          background:y===year?C.blue:C.surface,color:y===year?"#fff":C.muted,
          boxShadow:y===year?`0 4px 14px ${C.blue}44`:`0 1px 4px rgba(0,0,0,0.06)`}}>
          {y}년
        </button>
      ))}
    </div>
  );
}

// ─── ScheduleNotice ───────────────────────────────────────────────────────────
function ScheduleNotice({schedules,courses}) {
  const today=new Date().toISOString().slice(0,10);
  const dayNames=["일","월","화","수","목","금","토"];
  const upcoming=[...(schedules||[])]
    .filter(s=>s.date>=today)
    .sort((a,b)=>a.date.localeCompare(b.date))
    .slice(0,3);
  if(!upcoming.length) return null;
  const isToday=s=>s.date===today;
  const daysLeft=s=>{
    const diff=Math.round((new Date(s.date+"T12:00")-new Date(today+"T12:00"))/(1000*60*60*24));
    return diff===0?"오늘":diff===1?"내일":`${diff}일 후`;
  };
  return (
    <Card style={{overflow:"hidden",padding:0,marginBottom:16,border:`1.5px solid ${C.blue}30`}}>
      <div style={{padding:"10px 14px 8px",background:`linear-gradient(90deg,${C.blue}18,${C.purple}10)`,
        borderBottom:`1px solid ${C.blue}20`,display:"flex",alignItems:"center",gap:6}}>
        <span style={{fontSize:15}}>📅</span>
        <span style={{fontWeight:800,fontSize:13,color:C.blue}}>예정된 라운딩</span>
        <span style={{marginLeft:"auto",fontSize:11,fontWeight:700,color:C.purple,
          background:`${C.purple}15`,padding:"2px 8px",borderRadius:10}}>{upcoming.length}건</span>
      </div>
      {upcoming.map((s,i)=>{
        const course=(courses||[]).find(c=>c.id===s.courseId);
        const dObj=new Date(s.date+"T12:00");
        const today_=isToday(s);
        return (
          <div key={s.id} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",
            borderTop:i>0?`1px solid ${C.border}`:"none",
            background:today_?`${C.blue}08`:"#fff"}}>
            <div style={{flexShrink:0,textAlign:"center",width:40,
              background:today_?C.blue:C.bg,borderRadius:10,padding:"5px 4px",
              border:`1.5px solid ${today_?C.blue:C.border}`}}>
              <div style={{fontSize:10,fontWeight:700,color:today_?"#fff":C.muted}}>{s.date.slice(5,7)}/{s.date.slice(8,10)}</div>
              <div style={{fontSize:11,fontWeight:800,color:today_?"#fff":C.faint}}>{dayNames[dObj.getDay()]}</div>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:800,fontSize:13,color:C.text,
                whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.clubName}</div>
              <div style={{display:"flex",alignItems:"center",gap:6,marginTop:2}}>
                <span style={{fontSize:12,fontWeight:700,color:C.blue}}>🕐 {s.teeTime}</span>
                {course&&<span style={{fontSize:11,color:C.muted}}>{course.name}</span>}
              </div>
            </div>
            <div style={{flexShrink:0,fontWeight:800,fontSize:12,padding:"4px 10px",borderRadius:20,
              background:today_?C.blue:`${C.gold}20`,color:today_?"#fff":C.gold,
              border:`1.5px solid ${today_?C.blue:C.gold}40`}}>
              {daysLeft(s)}
            </div>
          </div>
        );
      })}
    </Card>
  );
}

// ─── SeasonView ───────────────────────────────────────────────────────────────
function SeasonView({players,rounds,handicaps,courses,year,onYearChange,schedules}) {
  const years = [...new Set(Object.keys(handicaps).map(Number))].sort((a,b)=>b-a);
  const yRounds = (rounds||[]).filter(r=>r.date.startsWith(year)).sort((a,b)=>a.date.localeCompare(b.date));
  const stats = computeStats(players, yRounds, handicaps, year);
  const sorted = [...stats].sort((a,b)=>{
    const da=(a.hcpDiff!==null&&a.hcpDiff!==undefined)?a.hcpDiff:9999;
    const db=(b.hcpDiff!==null&&b.hcpDiff!==undefined)?b.hcpDiff:9999;
    return da!==db ? da-db : (a.hcp??999)-(b.hcp??999);
  });
  return (
    <div>
      <ScheduleNotice schedules={schedules} courses={courses}/>
      <div style={{display:"flex",gap:8,marginBottom:20}}>
        {years.map(y=>(
          <button key={y} onClick={()=>onYearChange(y)} style={{padding:"8px 22px",borderRadius:30,
            border:"none",cursor:"pointer",fontWeight:700,fontSize:13,fontFamily:"inherit",
            background:y===year?C.blue:C.surface,color:y===year?"#fff":C.muted,
            boxShadow:y===year?`0 4px 14px ${C.blue}44`:`0 1px 4px rgba(0,0,0,0.08)`}}>
            {y}년
          </button>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:16}}>
        {sorted.map((s,i)=><PlayerCard key={s.id} stat={s} rank={i}/>)}
      </div>
      <Card style={{overflow:"hidden",padding:0}}>
        <div style={{padding:"12px 14px 9px",fontWeight:800,fontSize:13,color:C.text,
          borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:5}}>
          <span style={{color:C.blue}}>📊</span> {year} 시즌 스코어보드
        </div>
        <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
          <table style={{width:"100%",borderCollapse:"collapse",tableLayout:"fixed"}}>
            <colgroup>
              <col style={{width:"28%"}}/>
              {sorted.map(s=><col key={s.id} style={{width:`${72/sorted.length}%`}}/>)}
            </colgroup>
            <thead>
              <tr style={{background:C.blue}}>
                <th style={{padding:"8px 10px",textAlign:"left"}}>
                  <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.75)"}}>날짜 / 코스</div>
                </th>
                {sorted.map(s=>{
                  const Char=CHARS[s.id];
                  return (
                    <th key={s.id} style={{padding:"8px 4px",textAlign:"center"}}>
                      <div style={{width:26,height:26,borderRadius:"50%",overflow:"hidden",
                        margin:"0 auto 3px",background:C.bg,border:"2px solid rgba(255,255,255,0.8)"}}>
                        {Char&&<Char/>}
                      </div>
                      <div style={{fontSize:11,fontWeight:700,color:"#fff",whiteSpace:"nowrap"}}>{s.name}</div>
                    </th>
                  );
                })}
              </tr>
              <tr style={{background:"#fff1f2"}}>
                <td style={{padding:"6px 10px",fontSize:10,fontWeight:700,color:C.red}}>{year} 핸디</td>
                {sorted.map(s=>(
                  <td key={s.id} style={{textAlign:"center",fontFamily:"monospace",
                    fontWeight:800,fontSize:13,color:C.red,padding:"6px 4px"}}>{s.hcp??"-"}</td>
                ))}
              </tr>
            </thead>
            <tbody>
              {yRounds.map((r,ri)=>{
                const course=courses.find(c=>c.id===r.courseId);
                return (
                  <tr key={r.id} style={{background:ri%2===0?"#fff":C.bg}}>
                    <td style={{padding:"8px 10px",borderBottom:`1px solid ${C.border}`}}>
                      <div style={{fontSize:10,color:C.faint,lineHeight:1.3}}>{r.date.slice(5).replace("-",".")}</div>
                      <div style={{fontSize:12,fontWeight:700,color:C.blue,lineHeight:1.3,
                        whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{course?.name??"-"}</div>
                    </td>
                    {sorted.map(p=>{
                      const sc=r.scores.find(s=>s.pid===p.id);
                      const hcp=handicaps[year]?.[p.id];
                      const isBest=sc&&sc.score===p.best;
                      const isBelow=sc&&hcp&&sc.score<hcp;
                      return (
                        <td key={p.id} style={{textAlign:"center",fontFamily:"monospace",
                          fontWeight:800,fontSize:15,padding:"8px 4px",
                          borderBottom:`1px solid ${C.border}`,
                          background:isBelow?C.yellow:"transparent",
                          color:isBest?C.blue:C.text}}>
                          {sc?sc.score:"-"}
                          {sc?.birdies>0&&<span style={{fontSize:8,marginLeft:1}}>🦋</span>}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              {[
                {l:"평균",    k:"avgScore",f:v=>v??"-",       bg:"#f8faff",c:C.blue},
                {l:"버디",    k:"birdies", f:v=>v,            bg:"#fff5f5",c:C.red},
                {l:"핸디차이",k:"hcpDiff", f:v=>v!==null?(v>0?"+":"")+v:"-",bg:"#f0fdf4",c:C.green},
                {l:"핸디미만",k:"belowHcp",f:v=>v+"회",       bg:"#fdf2f8",c:C.pink},
                {l:"최저",    k:"best",   f:v=>v??"-",        bg:"#eff6ff",c:C.text},
              ].map(({l,k,f,bg,c})=>(
                <tr key={k} style={{borderTop:`1px solid ${C.border}`,background:bg}}>
                  <td style={{padding:"7px 10px",fontSize:11,fontWeight:700,color:C.muted}}>{l}</td>
                  {sorted.map(s=>(
                    <td key={s.id} style={{textAlign:"center",fontFamily:"monospace",
                      fontWeight:700,fontSize:13,padding:"7px 4px",color:c}}>{f(s[k])}</td>
                  ))}
                </tr>
              ))}
            </tfoot>
          </table>
        </div>
        <div style={{display:"flex",gap:10,padding:"8px 12px",fontSize:10,color:C.faint,
          borderTop:`1px solid ${C.border}`,flexWrap:"wrap"}}>
          <span><span style={{background:C.yellow,padding:"1px 5px",borderRadius:3}}>■</span> 핸디미만</span>
          <span style={{color:C.blue}}>■ 베스트</span>
        </div>
      </Card>
    </div>
  );
}

// ─── RoundEditModal ───────────────────────────────────────────────────────────
function RoundEditModal({round,players,courses,onSave,onClose}) {
  const [date,    setDate]    = useState(round.date);
  const [courseId,setCourseId]= useState(round.courseId);
  const [weather, setWeather] = useState(round.weather);
  const [memo,    setMemo]    = useState(round.memo||"");
  const [scores,  setScores]  = useState(
    (players||[]).map(p=>{
      const ex=round.scores.find(s=>s.pid===p.id);
      return ex?{...ex}:{pid:p.id,score:"",birdies:0};
    })
  );
  const upd=(i,f,v)=>{const n=[...scores];n[i]={...n[i],[f]:f==="birdies"?Number(v):v};setScores(n);};
  const save=()=>{
    if(!courseId){alert("⛳ 골프장을 검색해서 목록에서 선택해주세요. (DB에 없는 골프장은 관리 > 골프장 메뉴에서 먼저 추가해야 합니다)");return;}
    if(scores.some(s=>!s.score)){alert("모든 플레이어의 점수를 입력해주세요.");return;}
    onSave({...round,courseId,date,weather,memo,scores:scores.map(s=>({...s,score:Number(s.score)}))});
  };
  return (
    <Modal title="✏️ 라운드 수정" onClose={onClose}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:4}}>
        <FInput label="📅 날짜" type="date" value={date} onChange={e=>setDate(e.target.value)}/>
        <FSel label="☁️ 날씨" value={weather} onChange={e=>setWeather(e.target.value)}
          options={Object.entries(WEATHER_MAP).map(([k,v])=>({v:k,l:v}))}/>
      </div>
      <CourseSearchInput label="⛳ 골프장" courses={courses} value={courseId} onChange={setCourseId}/>
      <Card style={{overflow:"hidden",padding:0,marginBottom:12}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 72px",gap:8,padding:"10px 12px",
          background:C.blue,fontSize:11,fontWeight:700,color:"#fff"}}>
          <span>플레이어</span><span>총점</span><span style={{textAlign:"center"}}>버디</span>
        </div>
        {scores.map((s,i)=>{
          const p=(players||[]).find(pl=>pl.id===s.pid);
          const Char=p?CHARS[p.id]:null;
          const acc=p?ACCENTS[p.id]:C.blue;
          return (
            <div key={s.pid} style={{display:"grid",gridTemplateColumns:"1fr 1fr 72px",gap:8,
              padding:"10px 12px",alignItems:"center",borderTop:`1px solid ${C.border}`,
              background:i%2===0?"#fff":C.bg}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:30,height:30,borderRadius:"50%",overflow:"hidden",
                  border:`2px solid ${acc}`,flexShrink:0,background:C.bg}}>
                  {Char&&<Char/>}
                </div>
                <div style={{fontSize:12,fontWeight:700,color:C.text}}>{p?.name}</div>
              </div>
              <input type="number" placeholder="타수" value={s.score} min={60} max={180}
                onChange={e=>upd(i,"score",e.target.value)}
                style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:8,
                  padding:"8px",color:C.text,fontWeight:800,fontSize:16,fontFamily:"monospace",
                  textAlign:"center",outline:"none",width:"100%",boxSizing:"border-box"}}/>
              <div style={{display:"flex",alignItems:"center",gap:4,justifyContent:"center"}}>
                <button onClick={()=>upd(i,"birdies",Math.max(0,s.birdies-1))}
                  style={{width:22,height:22,borderRadius:6,border:`1px solid ${C.border}`,
                    background:C.surface,color:C.text,cursor:"pointer",fontSize:14,fontWeight:700,lineHeight:1}}>−</button>
                <span style={{fontFamily:"monospace",fontWeight:800,color:C.red,minWidth:16,textAlign:"center"}}>{s.birdies}</span>
                <button onClick={()=>upd(i,"birdies",s.birdies+1)}
                  style={{width:22,height:22,borderRadius:6,border:`1px solid ${C.border}`,
                    background:C.surface,color:C.text,cursor:"pointer",fontSize:14,fontWeight:700,lineHeight:1}}>+</button>
              </div>
            </div>
          );
        })}
      </Card>
      <FInput label="📝 메모" value={memo} onChange={e=>setMemo(e.target.value)} placeholder="특이사항 (선택)"/>
      <div style={{display:"flex",gap:8}}>
        <Btn onClick={save} color={C.blue} full>💾 수정 저장</Btn>
        <Btn onClick={onClose} color={C.muted} outline>취소</Btn>
      </div>
    </Modal>
  );
}

// ─── RoundsView ───────────────────────────────────────────────────────────────
function RoundsView({allRounds,courses,players,handicaps,isAdmin,setRounds}) {
  const years=[...new Set(Object.keys(handicaps).map(Number))].sort((a,b)=>b-a);
  const [year,setYear]=useState(years[0]??new Date().getFullYear());
  const [exp,setExp]=useState(null);
  const [editRound,setEditRound]=useState(null);
  const sorted=[...(allRounds||[])].filter(r=>r.date.startsWith(year)).sort((a,b)=>b.date.localeCompare(a.date));
  const handleDelete=(id)=>{
    if(!window.confirm("이 라운드 기록을 삭제하시겠습니까?"))return;
    setRounds(rs=>rs.filter(r=>r.id!==id));
    setExp(null);
  };
  const handleSaveEdit=(updated)=>{
    setRounds(rs=>rs.map(r=>r.id===updated.id?updated:r));
    setEditRound(null);
  };
  return (
    <div>
      <YearTabs year={year} years={years} onChange={y=>{setYear(y);setExp(null);}}/>
      {sorted.length===0&&<div style={{textAlign:"center",padding:"48px 0",color:C.faint,fontSize:14}}>{year}년 라운드 기록이 없습니다</div>}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {sorted.map(r=>{
          const course=courses.find(c=>c.id===r.courseId);
          const isOpen=exp===r.id;
          const minSc=Math.min(...r.scores.map(s=>s.score));
          const winner=players.find(p=>r.scores.find(s=>s.pid===p.id&&s.score===minSc));
          const winAcc=winner?ACCENTS[winner.id]:C.blue;
          const WinChar=winner?CHARS[winner.id]:null;
          return (
            <Card key={r.id} style={{overflow:"hidden",padding:0,border:`1.5px solid ${winAcc}22`}}>
              <div style={{height:3,background:winAcc}}/>
              <div onClick={()=>setExp(isOpen?null:r.id)}
                style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                  padding:"14px 16px",cursor:"pointer",gap:12}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:11,color:C.faint,marginBottom:2}}>{r.date.replace(/-/g,".")}</div>
                  <div style={{fontWeight:800,fontSize:16,color:C.text,
                    whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{course?.name??"-"}</div>
                  <div style={{display:"flex",gap:6,marginTop:4,alignItems:"center"}}>
                    <Stars n={course?.difficulty??3} sz={11}/>
                    <span style={{fontSize:11,color:C.muted}}>{WEATHER_MAP[r.weather]}</span>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:11,fontWeight:600,color:C.faint,marginBottom:2}}>🏅 우승</div>
                    <div style={{fontWeight:800,fontSize:15,color:winAcc,whiteSpace:"nowrap"}}>{winner?.name??"-"}</div>
                    <div style={{fontFamily:"monospace",fontWeight:900,fontSize:32,color:winAcc,lineHeight:1.1,letterSpacing:-1}}>{minSc}</div>
                  </div>
                  {WinChar&&(
                    <div style={{width:48,height:48,borderRadius:"50%",overflow:"hidden",
                      border:`2.5px solid ${winAcc}`,boxShadow:`0 2px 10px ${winAcc}44`,background:C.bg,flexShrink:0}}>
                      <WinChar/>
                    </div>
                  )}
                </div>
              </div>
              {isOpen&&(
                <div style={{borderTop:`1px solid ${C.border}`,padding:"12px 16px",background:C.bg}}>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
                    {[...r.scores].sort((a,b)=>a.score-b.score).map((s,ri)=>{
                      const p=players.find(pl=>pl.id===s.pid);
                      const Char=p?CHARS[p.id]:null;
                      const acc=p?ACCENTS[p.id]:C.blue;
                      const isWin=s.score===minSc;
                      const medals=["🥇","🥈","🥉","4️⃣"];
                      return (
                        <Card key={s.pid} style={{padding:"10px 12px",display:"flex",alignItems:"center",
                          gap:10,border:`1.5px solid ${isWin?acc+"60":acc+"22"}`,background:isWin?`${acc}08`:"#fff"}}>
                          <div style={{width:38,height:38,borderRadius:"50%",overflow:"hidden",
                            flexShrink:0,border:`2.5px solid ${acc}`,background:C.bg}}>
                            {Char&&<Char/>}
                          </div>
                          <div style={{flex:1}}>
                            <div style={{fontSize:12,fontWeight:700,color:C.text,display:"flex",alignItems:"center",gap:4}}>
                              <span>{medals[ri]}</span><span>{p?.name}</span>
                            </div>
                            <div style={{display:"flex",alignItems:"baseline",gap:5}}>
                              <span style={{fontFamily:"monospace",fontWeight:900,fontSize:24,color:isWin?acc:C.text}}>{s.score}</span>
                              {s.birdies>0&&<span style={{fontSize:11,color:C.red,display:"inline-flex",alignItems:"center",gap:2}}><Butterfly size={13}/>×{s.birdies}</span>}
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                  {r.memo&&<div style={{marginTop:10,fontSize:12,color:C.muted}}>📝 {r.memo}</div>}
                </div>
              )}
              {isAdmin&&(
                <div style={{display:"flex",gap:6,padding:"7px 12px",borderTop:`1px solid ${C.border}`,background:"#f8faff"}}>
                  <button onClick={e=>{e.stopPropagation();setEditRound(r);}}
                    style={{flex:1,background:"none",border:`1.5px solid ${C.blue}`,borderRadius:10,
                      padding:"6px 0",color:C.blue,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                    ✏️ 수정
                  </button>
                  <button onClick={e=>{e.stopPropagation();handleDelete(r.id);}}
                    style={{flex:1,background:"none",border:`1.5px solid ${C.red}`,borderRadius:10,
                      padding:"6px 0",color:C.red,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                    🗑 삭제
                  </button>
                </div>
              )}
              <div onClick={()=>setExp(isOpen?null:r.id)}
                style={{textAlign:"center",padding:"6px",borderTop:`1px solid ${C.border}`,
                  cursor:"pointer",fontSize:11,color:C.faint,background:C.bg}}>
                {isOpen?"▲ 접기":"▼ 전체 점수 보기"}
              </div>
            </Card>
          );
        })}
      </div>
      {editRound&&(
        <RoundEditModal round={editRound} players={players} courses={courses}
          onSave={handleSaveEdit} onClose={()=>setEditRound(null)}/>
      )}
    </div>
  );
}

// ─── AwardsView ───────────────────────────────────────────────────────────────
function AwardsView({players,allRounds,handicaps}) {
  const years=[...new Set(Object.keys(handicaps).map(Number))].sort((a,b)=>b-a);
  const [year,setYear]=useState(years[0]??new Date().getFullYear());
  const rounds=(allRounds||[]).filter(r=>r.date.startsWith(year));
  const stats=computeStats(players,rounds,handicaps,year);
  const awards=computeAwards(stats);
  const active=stats.filter(s=>s.roundCount>0);
  const minCS=active.length?Math.min(...active.map(champScore)):null;
  const champion=active.find(s=>champScore(s)===minCS);
  const ChampChar=champion?CHARS[champion.id]:null;
  const champAcc=champion?ACCENTS[champion.id]:C.blue;
  const items=[
    {emoji:"🦋",title:"버디왕",      color:C.red,  key:"birdie",   val:s=>`${s.birdies} 버디`},
    {emoji:"🎯",title:"베스트 스코어",color:C.blue, key:"best",     val:s=>`${s.best} 타`},
    {emoji:"📈",title:"핸디 향상왕",  color:C.green,key:"improved", val:s=>`평균 ${s.avgScore}타 (${s.hcpDiff>0?"+":""}${s.hcpDiff})`},
    {emoji:"📉",title:"도전상",       color:C.pink, key:"challenge",val:s=>`${s.belowHcp} 회`},
  ];
  const others=[...active].filter(s=>s.id!==champion?.id).sort((a,b)=>champScore(a)-champScore(b));
  const rankLabels=["🥈","🥉","4️⃣"];
  return (
    <div>
      <YearTabs year={year} years={years} onChange={setYear}/>
      <div style={{background:`linear-gradient(145deg,#2a1a7a 0%,${C.blue} 50%,${C.purple} 100%)`,
        borderRadius:24,marginBottom:20,overflow:"hidden",boxShadow:`0 12px 40px rgba(67,97,238,0.45)`,position:"relative"}}>
        <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
          {[[10,15,6],[25,40,4],[70,20,5],[85,10,7],[60,55,3],[40,70,5],[15,75,4],[90,65,6],[50,30,3],[75,80,5]].map(([l,t,s],i)=>(
            <div key={i} style={{position:"absolute",left:`${l}%`,top:`${t}%`,width:s,height:s,
              borderRadius:"50%",background:"rgba(255,255,255,0.7)",filter:"blur(1px)"}}/>
          ))}
        </div>
        {champion&&(
          <div style={{padding:"20px 20px 0",position:"relative"}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",zIndex:2}}>
              <div style={{fontSize:30,marginBottom:-6,filter:"drop-shadow(0 2px 8px rgba(255,215,0,0.9))"}}>👑</div>
              <div style={{width:112,height:112,borderRadius:"50%",overflow:"hidden",
                border:`4px solid ${C.gold}`,boxShadow:`0 0 0 6px rgba(255,215,0,0.25),0 8px 32px rgba(0,0,0,0.45)`,
                position:"relative"}}>
                <ChampChar/>
                <div style={{position:"absolute",top:0,left:0,right:0,height:"50%",
                  background:"linear-gradient(180deg,rgba(255,255,255,0.18),transparent)",
                  borderRadius:"50% 50% 0 0",pointerEvents:"none"}}/>
              </div>
              <div style={{marginTop:8,fontWeight:900,fontSize:22,color:"#fff",
                textShadow:"0 2px 12px rgba(0,0,0,0.4)",letterSpacing:-0.5}}>🥇 {champion.name}</div>
              <div style={{marginTop:8,display:"flex",alignItems:"center",gap:8}}>
                <div style={{background:C.green,color:"#fff",fontWeight:800,fontSize:13,
                  padding:"5px 16px",borderRadius:20,boxShadow:`0 2px 10px ${C.green}66`}}>
                  향상 {champion.hcpDiff>0?"+":""}{champion.hcpDiff}
                </div>
                <div style={{background:C.red,color:"#fff",fontWeight:800,fontSize:13,
                  padding:"5px 14px",borderRadius:20,boxShadow:`0 2px 10px ${C.red}55`,
                  display:"flex",alignItems:"center",gap:5}}>
                  <Butterfly size={13}/>{champion.birdies}버디
                </div>
              </div>
            </div>
          </div>
        )}
        <div style={{padding:"16px 20px 0",textAlign:"center",position:"relative"}}>
          <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.55)",letterSpacing:2,marginBottom:2}}>🏆 Season Champion</div>
          <div style={{color:"#fff",fontWeight:900,fontSize:22,letterSpacing:-0.8}}>{year}시즌 시상식</div>
        </div>
        {others.length>0&&(
          <div style={{display:"flex",justifyContent:"center",gap:12,margin:"16px 20px 0",
            borderTop:"1px solid rgba(255,255,255,0.12)",paddingTop:16}}>
            {others.map((s,i)=>{
              const SC=CHARS[s.id];const sa=ACCENTS[s.id];
              return (
                <div key={s.id} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,flex:1,maxWidth:90}}>
                  <div style={{width:54,height:54,borderRadius:"50%",overflow:"hidden",
                    border:`2.5px solid ${sa}`,background:"rgba(255,255,255,0.1)",boxShadow:"0 2px 10px rgba(0,0,0,0.3)"}}>
                    {SC&&<SC/>}
                  </div>
                  <div style={{fontSize:12,fontWeight:800,color:"rgba(255,255,255,0.9)"}}>{rankLabels[i]} {s.name}</div>
                  <div style={{fontSize:12,fontWeight:700,padding:"3px 10px",borderRadius:14,
                    background:"rgba(255,255,255,0.12)",
                    color:s.hcpDiff!==null&&s.hcpDiff<0?"#86efac":"rgba(255,255,255,0.55)"}}>
                    {s.hcpDiff!==null?(s.hcpDiff>0?"+":"")+s.hcpDiff:"-"}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div style={{background:"rgba(0,0,0,0.18)",padding:"10px 20px",textAlign:"center",
          fontSize:11,color:"rgba(255,255,255,0.55)",letterSpacing:0.5,marginTop:16}}>골술년 챌린지보드</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {items.map(item=>{
          const winners=awards?.[item.key]??[];
          return (
            <Card key={item.title} style={{overflow:"hidden",padding:0,border:`1.5px solid ${item.color}25`}}>
              <div style={{padding:"12px 16px 10px",background:`${item.color}10`,display:"flex",
                alignItems:"center",gap:8,borderBottom:`1px solid ${item.color}20`}}>
                <span style={{fontSize:20}}>{item.emoji}</span>
                <span style={{fontWeight:800,fontSize:14,color:item.color}}>{item.title}</span>
              </div>
              <div style={{padding:"12px 16px"}}>
                {winners.length===0&&<div style={{fontSize:12,color:C.faint}}>데이터 없음</div>}
                {winners.map(w=>{
                  const Char=CHARS[w.id];const acc=ACCENTS[w.id];
                  return (
                    <div key={w.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{width:36,height:36,borderRadius:"50%",overflow:"hidden",
                          border:`2px solid ${acc}`,background:C.bg}}>
                          {Char&&<Char/>}
                        </div>
                        <span style={{fontWeight:800,fontSize:15,color:C.text}}>{w.name}</span>
                      </div>
                      <span style={{fontFamily:"monospace",fontWeight:700,fontSize:12,padding:"5px 14px",
                        borderRadius:20,background:`${item.color}15`,color:item.color,border:`1px solid ${item.color}30`}}>
                        {item.val(w)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── Admin: Round Form ────────────────────────────────────────────────────────
function AdminRoundForm({players,courses,handicaps,year,onSave,initSched}) {
  const [date,    setDate]    = useState(initSched?.date||new Date().toISOString().slice(0,10));
  const [courseId,setCourseId]= useState(initSched?.courseId||(courses[0]?.id??""));
  const [weather, setWeather] = useState("SUNNY");
  const [memo,    setMemo]    = useState(initSched?`[${initSched.clubName}]`:"");
  const [scores,  setScores]  = useState((players||[]).map(p=>({pid:p.id,score:"",birdies:0})));
  const upd=(i,f,v)=>{const n=[...scores];n[i]={...n[i],[f]:f==="birdies"?Number(v):v};setScores(n);};
  const save=()=>{
    if(!courseId){alert("⛳ 골프장을 검색해서 목록에서 선택해주세요. (DB에 없는 골프장은 관리 > 골프장 메뉴에서 먼저 추가해야 합니다)");return;}
    if(scores.some(s=>!s.score)){alert("모든 플레이어의 점수를 입력해주세요.");return;}
    onSave({id:uid(),courseId,date,weather,memo,scores:scores.map(s=>({...s,score:Number(s.score)}))});
    setScores((players||[]).map(p=>({pid:p.id,score:"",birdies:0})));
    setMemo("");
  };
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:4}}>
        <FInput label="📅 날짜" type="date" value={date} onChange={e=>setDate(e.target.value)}/>
        <FSel label="☁️ 날씨" value={weather} onChange={e=>setWeather(e.target.value)}
          options={Object.entries(WEATHER_MAP).map(([k,v])=>({v:k,l:v}))}/>
      </div>
      <CourseSearchInput label="⛳ 골프장" courses={courses} value={courseId} onChange={setCourseId}/>
      <Card style={{overflow:"hidden",padding:0,marginBottom:12}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 72px",gap:8,padding:"10px 12px",
          background:C.blue,fontSize:11,fontWeight:700,color:"#fff"}}>
          <span>플레이어</span><span>총점</span><span style={{textAlign:"center"}}>버디</span>
        </div>
        {scores.map((s,i)=>{
          const p=(players||[]).find(pl=>pl.id===s.pid);
          const Char=p?CHARS[p.id]:null;
          const acc=p?ACCENTS[p.id]:C.blue;
          const hcp=handicaps[year]?.[s.pid];
          const filled=s.score!==""&&s.score!==null&&s.score!==undefined;
          return (
            <div key={s.pid} style={{display:"grid",gridTemplateColumns:"1fr 1fr 72px",gap:8,
              padding:"10px 12px",alignItems:"center",borderTop:`1px solid ${C.border}`,
              background:filled?C.yellowBg:(i%2===0?"#fff":C.bg)}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:30,height:30,borderRadius:"50%",overflow:"hidden",
                  border:`2px solid ${acc}`,flexShrink:0,background:C.bg}}>
                  {Char&&<Char/>}
                </div>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:C.text}}>{p?.name}</div>
                  {hcp&&<div style={{fontSize:10,color:C.faint}}>핸디 {hcp}</div>}
                </div>
              </div>
              <input type="number" placeholder="타수" value={s.score} min={60} max={180}
                onChange={e=>upd(i,"score",e.target.value)}
                style={{background:filled?C.yellow:"#fff",border:`1.5px solid ${filled?C.gold:C.border}`,
                  borderRadius:8,padding:"8px",color:C.text,fontWeight:800,fontSize:16,
                  fontFamily:"monospace",textAlign:"center",outline:"none",width:"100%",boxSizing:"border-box"}}/>
              <div style={{display:"flex",alignItems:"center",gap:4,justifyContent:"center"}}>
                <button onClick={()=>upd(i,"birdies",Math.max(0,s.birdies-1))}
                  style={{width:22,height:22,borderRadius:6,border:`1px solid ${C.border}`,
                    background:C.surface,color:C.text,cursor:"pointer",fontSize:14,fontWeight:700,lineHeight:1}}>−</button>
                <span style={{fontFamily:"monospace",fontWeight:800,color:C.red,minWidth:16,textAlign:"center"}}>{s.birdies}</span>
                <button onClick={()=>upd(i,"birdies",s.birdies+1)}
                  style={{width:22,height:22,borderRadius:6,border:`1px solid ${C.border}`,
                    background:C.surface,color:C.text,cursor:"pointer",fontSize:14,fontWeight:700,lineHeight:1}}>+</button>
              </div>
            </div>
          );
        })}
      </Card>
      <FInput label="📝 메모" value={memo} onChange={e=>setMemo(e.target.value)} placeholder="특이사항 (선택)"/>
      <Btn onClick={save} color={C.blue} full>💾 라운드 저장</Btn>
    </div>
  );
}

// ─── Admin: Course Manager ────────────────────────────────────────────────────
function CourseManager({courses,setCourses,onSaved}) {
  const [listSearch,setListSearch]=useState("");
  const [editId,setEditId]=useState(null);
  const [editData,setEditData]=useState({});
  const [nm,setNm]=useState(""); const [rg,setRg]=useState(""); const [df,setDf]=useState(3);
  const filtered=(courses||[]).filter(c=>c.name.includes(listSearch)||c.region.includes(listSearch)||listSearch==="");
  const startEdit=c=>{setEditId(c.id);setEditData({name:c.name,region:c.region,difficulty:c.difficulty});};
  const saveEdit=()=>{setCourses(cs=>cs.map(c=>c.id===editId?{...c,...editData}:c));setEditId(null);if(onSaved)onSaved();};
  return (
    <div>
      <Card style={{padding:14,background:C.bg,marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:700,color:C.blue,marginBottom:10}}>+ 골프장 추가</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <FInput value={nm} onChange={e=>setNm(e.target.value)} placeholder="골프장명"/>
          <FInput value={rg} onChange={e=>setRg(e.target.value)} placeholder="지역 (예: 경기 여주시)"/>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
          <span style={{fontSize:12,color:C.muted}}>난이도:</span>
          {[1,2,3,4,5].map(n=>(
            <button key={n} onClick={()=>setDf(n)}
              style={{background:"none",border:"none",cursor:"pointer",fontSize:20,
                color:n<=df?C.gold:C.border,padding:0}}>{n<=df?"★":"☆"}</button>
          ))}
        </div>
        <Btn onClick={()=>{
          if(!nm.trim()||!rg.trim())return;
          setCourses(cs=>[...cs,{id:uid(),name:nm.trim(),region:rg.trim(),difficulty:df}]);
          setNm("");setRg("");setDf(3);
          if(onSaved)onSaved();
        }} color={C.purple} full small>추가</Btn>
      </Card>
      <div style={{position:"relative",marginBottom:12}}>
        <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:15,color:C.faint}}>🔍</span>
        <input value={listSearch} onChange={e=>setListSearch(e.target.value)} placeholder="등록된 골프장 검색..."
          style={{width:"100%",background:C.surface,border:`1.5px solid ${C.border}`,borderRadius:12,
            padding:"11px 14px 11px 38px",color:C.text,fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}/>
        {listSearch&&<button onClick={()=>setListSearch("")}
          style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",
            background:"none",border:"none",color:C.faint,cursor:"pointer",fontSize:18}}>✕</button>}
      </div>
      {filtered.length===0&&<div style={{textAlign:"center",color:C.faint,fontSize:13,padding:16}}>검색 결과 없음</div>}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {filtered.map(c=>(
          <Card key={c.id} style={{padding:"12px 14px"}}>
            {editId===c.id?(
              <div>
                <FInput value={editData.name} onChange={e=>setEditData(d=>({...d,name:e.target.value}))} placeholder="골프장명"/>
                <FInput value={editData.region} onChange={e=>setEditData(d=>({...d,region:e.target.value}))} placeholder="지역"/>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                  <span style={{fontSize:12,color:C.muted}}>난이도:</span>
                  {[1,2,3,4,5].map(n=>(
                    <button key={n} onClick={()=>setEditData(d=>({...d,difficulty:n}))}
                      style={{background:"none",border:"none",cursor:"pointer",fontSize:20,
                        color:n<=editData.difficulty?C.gold:C.border,padding:0}}>{n<=editData.difficulty?"★":"☆"}</button>
                  ))}
                </div>
                <div style={{display:"flex",gap:8}}>
                  <Btn onClick={saveEdit} color={C.blue} small>✅ 저장</Btn>
                  <Btn onClick={()=>setEditId(null)} color={C.muted} outline small>취소</Btn>
                </div>
              </div>
            ):(
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div>
                  <div style={{fontWeight:700,fontSize:14,color:C.text}}>{c.name}</div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4}}>
                    <Chip color={C.muted}>{c.region}</Chip>
                    <Stars n={c.difficulty} sz={13}/>
                  </div>
                </div>
                <div style={{display:"flex",gap:6}}>
                  <Btn onClick={()=>startEdit(c)} color={C.blue} outline small>✏️ 편집</Btn>
                  <button onClick={()=>{setCourses(cs=>cs.filter(x=>x.id!==c.id));if(onSaved)onSaved("🗑 삭제");}}
                    style={{background:"none",border:`1.5px solid ${C.border}`,borderRadius:10,
                      padding:"6px 10px",color:C.faint,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>🗑</button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Admin: Player Manager ────────────────────────────────────────────────────
function PlayerManager({players,setPlayers,onSaved}) {
  const [nm,setNm]=useState(""); const [gd,setGd]=useState("M");
  return (
    <div>
      <div style={{display:"flex",gap:8,marginBottom:14}}>
        <FInput value={nm} onChange={e=>setNm(e.target.value)} placeholder="성명" style={{marginBottom:0,flex:1}}/>
        <select value={gd} onChange={e=>setGd(e.target.value)}
          style={{background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:10,
            padding:"10px 12px",color:C.text,fontSize:14,outline:"none",fontFamily:"inherit"}}>
          <option value="M">남성</option><option value="F">여성</option>
        </select>
        <Btn onClick={()=>{
          if(!nm.trim())return;
          setPlayers(p=>[...p,{id:uid(),name:nm.trim(),gender:gd}]);
          setNm(""); if(onSaved)onSaved();
        }} color={C.blue} small>추가</Btn>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {(players||[]).map(p=>{
          const Char=CHARS[p.id]; const acc=ACCENTS[p.id]??C.blue;
          return (
            <Card key={p.id} style={{padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:36,height:36,borderRadius:"50%",overflow:"hidden",
                  border:`2px solid ${acc}`,background:C.bg}}>
                  {Char?<Char/>:<span style={{fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",height:"100%"}}>{p.gender==="F"?"👩":"👨"}</span>}
                </div>
                <span style={{fontWeight:700,fontSize:14,color:C.text}}>{p.name}</span>
                <Chip color={acc}>{p.gender==="F"?"여성":"남성"}</Chip>
              </div>
              <button onClick={()=>{setPlayers(ps=>ps.filter(x=>x.id!==p.id));if(onSaved)onSaved("🗑 삭제");}}
                style={{background:"none",border:"none",color:C.faint,cursor:"pointer",fontSize:18,lineHeight:1}}>✕</button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── Admin: Handicap Manager ──────────────────────────────────────────────────
function HandicapManager({players,handicaps,setHandicaps,year,onSaved}) {
  const upd=(pid,v)=>{
    setHandicaps(h=>({...h,[year]:{...h[year],[pid]:Number(v)||0}}));
    if(onSaved)onSaved();
  };
  return (
    <div>
      <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:14}}>{year}년 핸디캡 설정</div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {(players||[]).map(p=>{
          const Char=CHARS[p.id]; const acc=ACCENTS[p.id]??C.blue;
          return (
            <Card key={p.id} style={{padding:"12px 14px",display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:36,height:36,borderRadius:"50%",overflow:"hidden",
                border:`2px solid ${acc}`,flexShrink:0,background:C.bg}}>
                {Char&&<Char/>}
              </div>
              <span style={{flex:1,fontWeight:700,fontSize:14,color:C.text}}>{p.name}</span>
              <input type="number" min={60} max={130} value={handicaps[year]?.[p.id]??""}
                onChange={e=>upd(p.id,e.target.value)}
                style={{width:72,background:"#fff1f2",border:"1.5px solid #fca5a5",borderRadius:10,
                  padding:"8px",color:C.red,fontWeight:800,fontSize:18,fontFamily:"monospace",
                  textAlign:"center",outline:"none"}}/>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── Admin: Schedule Manager ──────────────────────────────────────────────────
function ScheduleManager({schedules,setSchedules,courses,onSaved}) {
  const today=new Date().toISOString().slice(0,10);
  const [form,setForm]=useState({date:"",teeTime:"",courseId:"",clubName:""});
  const [editId,setEditId]=useState(null);
  const [editForm,setEditForm]=useState({});
  const upd=(k,v)=>setForm(f=>({...f,[k]:v}));
  const add=()=>{
    if(!form.date||!form.teeTime||!form.clubName){alert("날짜, 시간, 클럽명을 입력해주세요.");return;}
    setSchedules(ss=>[...ss,{id:uid(),...form}]);
    setForm({date:"",teeTime:"",courseId:"",clubName:""});
    if(onSaved)onSaved("📅 일정 등록");
  };
  const remove=id=>setSchedules(ss=>ss.filter(s=>s.id!==id));
  const saveEdit=()=>{setSchedules(ss=>ss.map(s=>s.id===editId?{...editForm}:s));setEditId(null);if(onSaved)onSaved();};
  const sorted=[...(schedules||[])].sort((a,b)=>a.date.localeCompare(b.date));
  const upcoming=sorted.filter(s=>s.date>=today);
  const past=sorted.filter(s=>s.date<today);
  const SchedRow=({s,isPast})=>{
    const course=(courses||[]).find(c=>c.id===s.courseId);
    const isToday=s.date===today;
    const dObj=new Date(s.date+"T12:00");
    const dayNames=["일","월","화","수","목","금","토"];
    return (
      <div style={{borderRadius:14,overflow:"hidden",
        border:`1.5px solid ${isToday?C.blue:C.border}`,background:isToday?`${C.blue}08`:"#fff",opacity:isPast?0.6:1}}>
        {isToday&&<div style={{background:C.blue,padding:"5px 14px",fontSize:11,fontWeight:700,color:"#fff"}}>🏌️ 오늘 라운딩!</div>}
        {editId===s.id?(
          <div style={{padding:"12px 14px"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
              <FInput value={editForm.date} onChange={e=>setEditForm(f=>({...f,date:e.target.value}))} type="date" style={{marginBottom:0}}/>
              <FInput value={editForm.teeTime} onChange={e=>setEditForm(f=>({...f,teeTime:e.target.value}))} type="time" style={{marginBottom:0}}/>
            </div>
            <FInput value={editForm.clubName} onChange={e=>setEditForm(f=>({...f,clubName:e.target.value}))} placeholder="골프클럽명"/>
            <CourseSearchInput courses={courses} value={editForm.courseId||""} nullable
              placeholder="코스 검색 (선택사항)"
              onChange={v=>setEditForm(f=>({...f,courseId:v}))}/>
            <div style={{display:"flex",gap:8}}>
              <Btn onClick={saveEdit} color={C.blue} small>저장</Btn>
              <Btn onClick={()=>setEditId(null)} color={C.muted} outline small>취소</Btn>
            </div>
          </div>
        ):(
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px"}}>
            <div style={{flexShrink:0,textAlign:"center",width:46,background:isToday?C.blue:C.bg,borderRadius:12,padding:"6px 4px"}}>
              <div style={{fontSize:11,fontWeight:700,color:isToday?"#fff":C.muted}}>{s.date.slice(5,7)}월</div>
              <div style={{fontSize:20,fontWeight:900,lineHeight:1,color:isToday?"#fff":C.text}}>{s.date.slice(8,10)}</div>
              <div style={{fontSize:10,color:isToday?"rgba(255,255,255,0.8)":C.faint}}>{dayNames[dObj.getDay()]}</div>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:800,fontSize:14,color:C.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.clubName}</div>
              <div style={{display:"flex",alignItems:"center",gap:6,marginTop:3,flexWrap:"wrap"}}>
                <span style={{fontSize:13,fontWeight:700,color:C.blue}}>🕐 {s.teeTime}</span>
                {course&&<Chip color={C.purple}>{course.name}</Chip>}
              </div>
            </div>
            <div style={{display:"flex",gap:5,flexShrink:0}}>
              <button onClick={()=>{setEditId(s.id);setEditForm({...s});}}
                style={{background:"none",border:`1px solid ${C.border}`,borderRadius:8,padding:"5px 9px",color:C.muted,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>✏️</button>
              <button onClick={()=>remove(s.id)}
                style={{background:"none",border:`1px solid ${C.border}`,borderRadius:8,padding:"5px 9px",color:"#f87171",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>🗑</button>
            </div>
          </div>
        )}
      </div>
    );
  };
  return (
    <div>
      <Card style={{padding:14,marginBottom:16,background:C.bg}}>
        <div style={{fontSize:12,fontWeight:700,color:C.blue,marginBottom:10}}>+ 새 라운딩 일정 등록</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <FInput label="📅 날짜" type="date" value={form.date} onChange={e=>upd("date",e.target.value)}/>
          <FInput label="🕐 티오프" type="time" value={form.teeTime} onChange={e=>upd("teeTime",e.target.value)}/>
        </div>
        <FInput label="🏌️ 골프클럽명" value={form.clubName} onChange={e=>upd("clubName",e.target.value)} placeholder="예: 파인리조트 골프클럽"/>
        <CourseSearchInput label="⛳ 코스 연결 (선택)" courses={courses} value={form.courseId} nullable
          placeholder="코스 검색 (선택 안 해도 됨)"
          onChange={v=>upd("courseId",v)}/>
        <Btn onClick={add} color={C.blue} full>등록</Btn>
      </Card>
      {upcoming.length>0&&(
        <div style={{marginBottom:16}}>
          <div style={{fontSize:11,fontWeight:700,color:C.muted,marginBottom:8,letterSpacing:0.5}}>예정 일정 ({upcoming.length})</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {upcoming.map(s=><SchedRow key={s.id} s={s} isPast={false}/>)}
          </div>
        </div>
      )}
      {past.length>0&&(
        <div>
          <div style={{fontSize:11,fontWeight:700,color:C.faint,marginBottom:8}}>지난 일정 ({past.length})</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {[...past].reverse().map(s=><SchedRow key={s.id} s={s} isPast={true}/>)}
          </div>
        </div>
      )}
      {upcoming.length===0&&past.length===0&&(
        <div style={{textAlign:"center",padding:"32px 0",color:C.faint,fontSize:14}}>등록된 일정이 없습니다</div>
      )}
    </div>
  );
}

// ─── DB Panel ─────────────────────────────────────────────────────────────────
function DBPanel({players,courses,rounds,handicaps,onReset}) {
  const years=[...new Set(Object.keys(handicaps).map(Number))].sort((a,b)=>b-a);
  const rows=[
    {icon:"👤",label:"플레이어",count:`${(players||[]).length}명`,    color:C.blue},
    {icon:"⛳",label:"골프장",  count:`${(courses||[]).length}개`,     color:C.purple},
    {icon:"🏌️",label:"라운드",  count:`${(rounds||[]).length}라운드`,  color:C.green},
    {icon:"📋",label:"핸디 연도",count:`${years.join(", ")}년`,        color:C.gold},
  ];
  return (
    <div>
      <Card style={{padding:0,overflow:"hidden",marginBottom:14}}>
        <div style={{padding:"12px 14px 9px",fontWeight:800,fontSize:13,color:C.text,
          borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:6}}>
          <span>💾</span> 저장된 데이터 현황
        </div>
        {rows.map((r,i)=>(
          <div key={r.label} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 16px",
            borderBottom:i<rows.length-1?`1px solid ${C.border}`:"none",background:i%2===0?"#fff":C.bg}}>
            <span style={{fontSize:20}}>{r.icon}</span>
            <span style={{flex:1,fontWeight:600,fontSize:13,color:C.text}}>{r.label}</span>
            <span style={{fontFamily:"monospace",fontWeight:800,fontSize:13,padding:"4px 12px",
              borderRadius:20,background:`${r.color}15`,color:r.color,border:`1px solid ${r.color}30`}}>
              {r.count}
            </span>
          </div>
        ))}
      </Card>
      <Card style={{padding:16,background:"#fff7ed",border:"1.5px solid #fed7aa"}}>
        <div style={{fontWeight:700,fontSize:13,color:"#c2410c",marginBottom:6}}>⚠️ 데이터 초기화</div>
        <div style={{fontSize:12,color:"#9a3412",marginBottom:14,lineHeight:1.6}}>
          모든 데이터가 샘플 초기값으로 되돌아갑니다.
        </div>
        <Btn onClick={onReset} color="#dc2626" full small>🗑 전체 초기화</Btn>
      </Card>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [players,   setPlayers,   rP] = useStored("gcb_players",   INIT_PLAYERS);
  const [courses,   setCourses,   rC] = useStored("gcb_courses",   INIT_COURSES);
  const [rounds,    setRounds,    rR] = useStored("gcb_rounds",    INIT_ROUNDS);
  const [handicaps, setHandicaps, rH] = useStored("gcb_handicaps", INIT_HANDICAPS);
  const [schedules, setSchedules, rS] = useStored("gcb_schedules", []);
  const isReady = rP && rC && rR && rH && rS;

  const [year,setYear]=useState(2026);
  const [tab,setTab]=useState("season");
  const [aTab,setATab]=useState("input");
  const [isAdmin,setIsAdmin]=useState(false);
  const [showLogin,setShowLogin]=useState(false);
  const [lid,setLid]=useState(""); const [lpw,setLpw]=useState(""); const [lerr,setLerr]=useState("");
  const [saveMsg,setSaveMsg]=useState("");
  const [todayAlert,setTodayAlert]=useState(null);
  const [autoSched,setAutoSched]=useState(null);

  const saved=(msg="✅ 저장되었습니다")=>{setSaveMsg(msg);setTimeout(()=>setSaveMsg(""),2500);};

  useEffect(()=>{
    if(!schedules||!schedules.length)return;
    const today=new Date().toISOString().slice(0,10);
    const hit=schedules.find(s=>s.date===today);
    if(hit)setTodayAlert(hit);
  },[schedules]);

  const login=()=>{
    if(lid==="admin"&&lpw==="golf2025"){setIsAdmin(true);setShowLogin(false);setTab("admin");setATab("input");setLid("");setLpw("");setLerr("");}
    else setLerr("아이디 또는 비밀번호가 올바르지 않습니다.");
  };
  const resetDB=()=>{
    if(!window.confirm("모든 데이터를 초기값으로 되돌립니까?"))return;
    setPlayers(INIT_PLAYERS);setCourses(INIT_COURSES);setRounds(INIT_ROUNDS);setHandicaps(INIT_HANDICAPS);setSchedules([]);
    saved("🔄 초기화되었습니다");
  };

  const NAV=[{id:"season",Icon:IconSeason,label:"현황"},{id:"rounds",Icon:IconRounds,label:"라운드"},{id:"awards",Icon:IconAwards,label:"시상"},{id:"admin",Icon:IconAdmin,label:"관리"}];
  const ATABS=[{id:"schedule",l:"📅 라운딩 예정"},{id:"input",l:"라운드 입력"},{id:"courses",l:"골프장"},{id:"players",l:"플레이어"},{id:"handicap",l:"핸디캡"},{id:"db",l:"💾 DB"}];

  if(!isReady) return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",gap:16,fontFamily:"sans-serif"}}>
      <div style={{fontSize:48}}>⛳</div>
      <div style={{fontWeight:800,fontSize:18,color:C.blue}}>골술년 챌린지보드</div>
      <div style={{fontSize:13,color:C.faint}}>데이터 로딩 중...</div>
      <div style={{width:36,height:36,border:`3px solid ${C.border}`,borderTop:`3px solid ${C.blue}`,
        borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:C.bg,paddingBottom:76,
      fontFamily:"'Noto Sans KR','Apple SD Gothic Neo',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap');
        *{box-sizing:border-box;}
        input::placeholder{color:#94a3b8;}
        input[type=number]::-webkit-inner-spin-button{opacity:1;}
        ::-webkit-scrollbar{width:3px;height:3px;}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px;}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeup{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {saveMsg&&(
        <div style={{position:"fixed",top:70,left:"50%",transform:"translateX(-50%)",
          background:C.text,color:"#fff",padding:"9px 20px",borderRadius:30,fontSize:13,fontWeight:700,
          zIndex:200,whiteSpace:"nowrap",animation:"fadeup 0.2s ease",boxShadow:"0 4px 16px rgba(0,0,0,0.18)"}}>
          {saveMsg}
        </div>
      )}

      {todayAlert&&(
        <div style={{position:"fixed",top:60,left:0,right:0,zIndex:90,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 12px"}}>
          <div style={{maxWidth:480,width:"100%",background:`linear-gradient(135deg,${C.blue},${C.purple})`,
            borderRadius:16,padding:"14px 16px",margin:"8px auto",boxShadow:`0 6px 28px rgba(59,91,219,0.4)`,
            display:"flex",alignItems:"center",gap:12,animation:"fadeup 0.3s ease"}}>
            <span style={{fontSize:28,flexShrink:0}}>⛳</span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{color:"rgba(255,255,255,0.8)",fontSize:11,fontWeight:600}}>오늘 라운딩 예정!</div>
              <div style={{color:"#fff",fontWeight:800,fontSize:14,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{todayAlert.clubName} · {todayAlert.teeTime}</div>
            </div>
            <div style={{display:"flex",gap:6,flexShrink:0}}>
              {isAdmin&&(
                <button onClick={()=>{setAutoSched(todayAlert);setTab("admin");setATab("input");setTodayAlert(null);}}
                  style={{background:"#fff",border:"none",borderRadius:10,padding:"7px 12px",color:C.blue,fontWeight:800,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>점수 입력</button>
              )}
              <button onClick={()=>setTodayAlert(null)} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:10,padding:"7px 10px",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer"}}>✕</button>
            </div>
          </div>
        </div>
      )}

      <header style={{background:C.surface,borderBottom:`1px solid ${C.border}`,position:"sticky",top:0,zIndex:40,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
        <div style={{maxWidth:480,margin:"0 auto",padding:"11px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontWeight:900,fontSize:19,letterSpacing:-0.8,lineHeight:1.1,color:C.text}}>
              <span style={{background:`linear-gradient(90deg,${C.blue},${C.purple})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>골술년</span>{" "}챌린지보드
            </div>
            <div style={{fontSize:11,color:C.faint,marginTop:1}}>⛳ Golf Challenge Board {year}</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {isAdmin&&<Chip color={C.blue}>관리자</Chip>}
            {isAdmin
              ?<Btn onClick={()=>{setIsAdmin(false);setTab("season");}} color={C.muted} outline small>로그아웃</Btn>
              :<Btn onClick={()=>setShowLogin(true)} color={C.blue} small>관리자</Btn>}
          </div>
        </div>
      </header>

      <div style={{maxWidth:480,margin:"0 auto",padding:"12px 12px 0"}}>
        {tab==="season"&&<SeasonView players={players} rounds={rounds} handicaps={handicaps} courses={courses} year={year} onYearChange={setYear} schedules={schedules}/>}
        {tab==="rounds"&&<RoundsView allRounds={rounds} courses={courses} players={players} handicaps={handicaps} isAdmin={isAdmin} setRounds={setRounds}/>}
        {tab==="awards"&&<AwardsView players={players} allRounds={rounds} handicaps={handicaps}/>}
        {tab==="admin"&&(
          !isAdmin?(
            <div style={{textAlign:"center",paddingTop:60}}>
              <div style={{fontSize:56,marginBottom:12}}>🔐</div>
              <div style={{color:C.muted,fontSize:14,marginBottom:24}}>관리자 로그인이 필요합니다</div>
              <Btn onClick={()=>setShowLogin(true)} color={C.blue}>로그인하기</Btn>
            </div>
          ):(
            <div>
              <div style={{display:"flex",gap:6,marginBottom:16,overflowX:"auto",paddingBottom:4}}>
                {ATABS.map(t=>(
                  <button key={t.id} onClick={()=>setATab(t.id)} style={{padding:"8px 18px",borderRadius:30,
                    border:"none",cursor:"pointer",fontWeight:700,fontSize:12,whiteSpace:"nowrap",flexShrink:0,fontFamily:"inherit",
                    background:aTab===t.id?C.blue:C.surface,color:aTab===t.id?"#fff":C.muted,
                    boxShadow:aTab===t.id?`0 4px 14px ${C.blue}40`:`0 1px 4px rgba(0,0,0,0.06)`}}>
                    {t.l}
                  </button>
                ))}
              </div>
              {aTab==="schedule"&&<ScheduleManager schedules={schedules} setSchedules={setSchedules} courses={courses} onSaved={saved}/>}
              {aTab==="input"   &&<AdminRoundForm players={players} courses={courses} handicaps={handicaps} year={year}
                initSched={autoSched} onSave={r=>{
                  setRounds(rs=>[...rs,r]);
                  // 같은 날짜의 예정 일정은 라운드 기록 완료로 간주하여 즉시 제거(예정 목록에서 사라짐)
                  setSchedules(ss=>(ss||[]).filter(s=>s.date!==r.date));
                  setTodayAlert(a=>(a&&a.date===r.date)?null:a);
                  saved("✅ 라운드 저장 완료 · 일정 업데이트됨");
                  setAutoSched(null);
                }}/>}
              {aTab==="courses" &&<CourseManager courses={courses} setCourses={setCourses} onSaved={saved}/>}
              {aTab==="players" &&<PlayerManager players={players} setPlayers={setPlayers} onSaved={saved}/>}
              {aTab==="handicap"&&<HandicapManager players={players} handicaps={handicaps} setHandicaps={setHandicaps} year={year} onSaved={saved}/>}
              {aTab==="db"      &&<DBPanel players={players} courses={courses} rounds={rounds} handicaps={handicaps} onReset={resetDB}/>}
            </div>
          )
        )}
      </div>

      <nav style={{position:"fixed",bottom:0,left:0,right:0,background:C.surface,
        borderTop:`1px solid ${C.border}`,zIndex:40,boxShadow:"0 -2px 12px rgba(0,0,0,0.06)"}}>
        <div style={{maxWidth:480,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(4,1fr)"}}>
          {NAV.map(n=>{
            const active=tab===n.id;
            return (
              <button key={n.id} onClick={()=>{if(n.id==="admin"&&!isAdmin)setShowLogin(true);else setTab(n.id);}}
                style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"10px 0 10px",
                  border:"none",background:"none",cursor:"pointer",fontFamily:"inherit",
                  color:active?C.blue:C.faint,borderTop:`2.5px solid ${active?C.blue:"transparent"}`,transition:"all 0.15s"}}>
                <n.Icon active={active} color={C.blue}/>
                <span style={{fontSize:13,fontWeight:active?700:500,marginTop:4,color:active?C.blue:C.faint}}>{n.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {showLogin&&(
        <Modal title="🔐 관리자 로그인" onClose={()=>{setShowLogin(false);setLerr("");}}>
          <FInput label="아이디" value={lid} onChange={e=>setLid(e.target.value)} placeholder="admin"/>
          <FInput label="비밀번호" type="password" value={lpw} onChange={e=>setLpw(e.target.value)} placeholder="••••••••"
            onKeyDown={e=>e.key==="Enter"&&login()}/>
          {lerr&&<div style={{fontSize:12,color:C.red,marginBottom:12}}>{lerr}</div>}
          <Btn onClick={login} color={C.blue} full>로그인</Btn>
          <div style={{textAlign:"center",fontSize:11,color:C.faint,marginTop:12}}>ID: admin · PW: golf2025</div>
        </Modal>
      )}
    </div>
  );
}
