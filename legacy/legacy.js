class CoonyangMain {
    static templateSelector = "#coonyang";

    static MissionState = {
        START: "start",
        END: "end",
    };

    static TouchState = {
        START: "start",
        TOUCH: "touch",
        COMPLETE: "complete",
    };

    constructor() {
        this.view = new CoonyangView({});
        this.model = new CoonyangModel({});

        this.render().then();
    }

    async fetch() {
        const { status, code, message, data } = await this.model.info();

        $.extend(this, data);

        return { status, code, message, data };
    }

    async render() {
        appStatusState.setAppPushSt(); // 앱푸시 상태 로드시점에 미리 저장 appStatusState.getAppPushSt() === "on"

        const { status, code } = await this.fetch();

        await delay(1200);
        this.view.removeInitLoading();

        this.view.updateGNBLevelGage({ level: this.actCount, isAnimate: false });

        if (!status) {
            // code:8600 참여정보가 없음
            if (code === 8600) {
                this.intro();
            }
        } else {
            if (this.actTotalCount === 0) {
                this.tutorial({ state: CoonyangMain.MissionState.START }).then();
            } else {
                this.main({ stat: CoonyangMain.MissionState.START }).then();
            }
        }

        this.extraSetting().then();
    }

    /**
     * 부가기능 설정
     * 팝오버, 앱 권한 상태 로드 등
     */
    async extraSetting() {
        new Popover({
            buttonSelector: `#coonyang_gnb .info`,
            spaceInterval: 5,
            content: `
                <ul class="popover-tooltip-common">
                    <li>잼 만들기는 3시간에 한 번만 할 수 있어요.</li>
                    <li>잼 만들기를 4번 하면 딸기잼 한 병이 완성돼요.</li>
                    <li>딸기잼 한 병을 완성하면 쿠냥이가 수고비로 적립금을 드려요!</li>
                    <li>적립금은 최대 30,000원까지 랜덤으로 지급돼요.</li>
                    <li>지급된 적립금은 마이쿠캣 > <a class="cc-clr-t-blk cc-t-deco-u cc-pretendard-b" href="/ko/mypage/point">적립금 내역</a>에서 확인하실 수 있어요.</li>
                    <li>적립금의 유효기간은 적립일로부터 12개월이에요.</li>
                </ul>
            `,
        });

        if (this.actTotalCount === 2 && appStatusState.getAppPushSt() !== "on" && isApp()) {
            gfPopV2("알림 수신 동의", "마케팅 정보 수신 동의하고 쿠캣 오픈 알림 앱 푸시를 받으시겠습니까?", {
                okay_txt: "동의하고 알림 받기",
                close_txt: "취소",
                btn_style: 2,
                callback: function () {
                    CUSTOMER_SETTING.switch_topic_st({ checked: true });
                },
            });
        }
    }

    // A-1 인트로
    intro() {
        this.view.updateGNBType("back");

        this.view.mountViewConversation();

        this.dialog = new CoonyangDialog({
            scenario: [
                {
                    text: "안녕? 나는 쿠냥이야. 너의 이름은 뭐야?",
                    profileName: "coo_normal",
                    callback: () => {
                        this.view.updateConversationCat({
                            speechingNow: "ku",
                        });
                    },
                },
                {
                    text: "나?! 내 이름은...",
                    profileName: "user_close",
                    callback: () => {
                        this.view.updateConversationCat({
                            userFace: "user_face_close.png",
                            speechingNow: "user",
                        });
                    },
                },
            ],
            finishCallback: () => {
                this.dialog.destroy(); // dialog 종료
                this.createUserName().then();
            },
        });
    }

    // A-2 닉네임 설정
    async createUserName() {
        this.view.updateGNBType("none");

        const { status, data } = await this.model.recommend();

        if (!status) {
            gfPopV2("닉네임 추천에 실패했습니다. 다시 시도해주세요.");
            return;
        }

        const { recommendAka } = data;

        this.view.mountViewCreateUserName({
            text: `내 이름은 바로<br>${recommendAka} 냥이야!`,
            selectEvent: async () => {
                const { status, message } = await this.model.join(recommendAka);

                if (status) {
                    this.makerAka = recommendAka;
                    this.story();
                } else {
                    gfPopV2(message);
                }
            },
            otherEvent: async () => {
                this.createUserName().then();
            },
        });
    }

    // A-3 스토리 진행
    story() {
        this.view.updateGNBType("back");

        this.view.mountViewConversation();

        this.dialog = new CoonyangDialog({
            scenario: [
                {
                    text: `좋아, ${this.makerAka} 냥! 너 꾹꾹이 할 줄 알지? 찹쌀떡에 넣을 딸기잼 만드는 것 좀 도와줄래?`,
                    profileName: "coo_normal",
                    callback: () => {
                        this.view.updateConversationCat({
                            userFace: "user_face_close.png",
                            speechingNow: "ku",
                        });
                    },
                },
                {
                    text: "뭐? 내가 왜! 나 바쁜 고양이거든?!",
                    profileName: "user_cynical",
                    callback: () => {
                        this.view.updateConversationCat({
                            userFace: "user_face_cynical.png",
                            speechingNow: "user",
                        });
                    },
                },
                {
                    text: "내가 지금 급해서 그래! 도와주면 수고비도 줄게!",
                    profileName: "coo_normal",
                    callback: () => {
                        this.view.updateConversationCat({
                            speechingNow: "ku",
                        });
                    },
                },
                {
                    text: "수고비...? 크흠! 그럼 뭐 한번 도와줘 볼까!",
                    profileName: "user_normal",
                    callback: () => {
                        this.view.updateConversationCat({
                            userFace: "user_face_side.png",
                            userSpeech: "speech_reaction.png",
                            speechingNow: "user",
                        });
                    },
                },
            ],
            finishCallback: () => {
                this.dialog.destroy();
                this.tutorial({}).then();
            },
        });
    }

    /**
     * B-2 메인
     * @param state "start" | "end" - 화면 진입인지 미션 완료 후 결과인지
     * @param rewardFlag
     * @param reward
     */
    async main({ state = CoonyangMain.MissionState.START, rewardFlag = false, reward = null }) {
        await this.fetch();

        const dialogComment = ["난 찹쌀떡을 팔아서 부자가 될거야!", "뭐해? 어서 실력 발휘 좀 해보라구!", "딸기가 싱싱한 게 아주 맛있는 잼이 되겠는걸?", "자, 거의 다 왔어! 마지막으로 힘내보자!", "오오, 드디어...!"];

        this.view.updateGNBType("all");

        if (state === CoonyangMain.MissionState.END) {
            this.view.updateDuringLoading(true);
            await delay(1000);
            this.view.updateDuringLoading(false);

            this.view.updateGNBLevelGage({ level: this.actCount, isAnimate: true });
        }

        this.view.mountViewMission({ actCount: this.actCount, makeAvailableSeconds: this.makeAvailableSeconds });

        this.view.addEventMission({
            toMakeJamEvent: () => {
                this.dialog.destroy();
                this.touch();
            },
        });

        this.dialog = new CoonyangDialog({
            scenario: [
                {
                    text: dialogComment[this.actCount],
                    profileName: "coo_normal",
                    isLast: true,
                },
            ],
        });

        if (rewardFlag) {
            await delay(2000);
            this.rewardPopup({ reward }).then();
        }
    }

    /**
     * B-1 튜토리얼
     * @param state "start" | "end" - 튜토리얼 완료 여부
     */
    async tutorial({ state = CoonyangMain.MissionState.START }) {
        await this.fetch();

        this.view.updateGNBType("all");

        if (state === CoonyangMain.MissionState.END) {
            this.view.updateDuringLoading(true);
            await delay(1000);
            this.view.updateDuringLoading(false);

            this.view.updateGNBLevelGage({ level: this.actCount, isAnimate: true });
        }

        this.view.mountViewMission({ actCount: this.actCount, makeAvailableSeconds: this.makeAvailableSeconds });

        this.view.addEventMission({
            toMakeJamEvent: () => {
                this.dialog.destroy();
                this.touch();
            },
        });

        if (state === CoonyangMain.MissionState.START) {
            this.view.updateTutorialDimmed(true);

            this.dialog = new CoonyangDialog({
                scenario: [
                    {
                        text: "그럼 이제 [딸기잼 만들기] 버튼을 눌러 네 꾹꾹이 실력을 보여줘!",
                        profileName: "coo_normal",
                        isLast: true,
                    },
                ],
            });
        } else {
            this.dialog = new CoonyangDialog({
                scenario: [
                    {
                        text: "역시 내 눈은 틀리지 않았어! 앞으로도 계속 딸기잼을 만들어줄래?",
                        profileName: "coo_normal",
                    },
                    {
                        text: "싫어! 발바닥 젤리가 불타는 줄 알았다구...!",
                        profileName: "user_cynical",
                    },
                    {
                        text: "하핫...! 꾹꾹이 후엔 발바닥이 아플 테니 열 식히는 시간을 꼭 가지도록 해!",
                        profileName: "coo_normal",
                    },
                    {
                        text: "쉬는 동안 쿠캣을 둘러보고 와도 좋고!",
                    },
                    {
                        text: "(뭔가 단단히 잘못 걸린 것 같다...!)",
                        profileName: "user_cynical",
                    },
                    {
                        text: "딸기잼을 4번 만들면 한 병이 완성돼. 그때마다 최대 3만원의 적립금을 수고비로 줄게!",
                        profileName: "coo_normal",
                    },
                    {
                        text: "그렇다면...할만 할지도...?",
                        profileName: "user_cynical",
                    },
                    {
                        text: "하하하! 그럴 줄 알았어! 그럼 앞으로 잘 부탁해!",
                        profileName: "coo_normal",
                        isLast: true,
                    },
                ],
            });
        }
    }

    touch() {
        let touchCount = 0;

        this.view.updateGNBType("back");

        this.view.mountViewTouch({});

        this.view.updateTouchState({ state: CoonyangMain.TouchState.START });

        this.view.addEventTouch({
            touchEvent: () => {
                touchCount++;

                if (touchCount === 1) {
                    this.view.updateTouchState({ state: CoonyangMain.TouchState.TOUCH });
                    this.dialog.update({
                        text: "조금 더 빨리! 딸기가 산더미처럼 쌓여있다구!",
                    });
                } else if (touchCount === 10) {
                    this.dialog.update({
                        text: "아직 부족해! 발바닥 젤리에 불이 날 때까지 누르란 말이야!",
                    });
                } else if (touchCount === 20) {
                    this.dialog.update({
                        text: `조금만 더...! 거의 다왔어 ${this.makerAka}!`,
                    });
                } else if (touchCount === 30) {
                    this.view.updateTouchState({ state: CoonyangMain.TouchState.COMPLETE });

                    this.dialog.destroy();
                    this.dialog = new CoonyangDialog({
                        scenario: [
                            {
                                text: "아... 나의 발바닥 젤리에 불이 나는군...!",
                                profileName: "user_close",
                            },
                        ],
                        finishCallback: async () => {
                            this.dialog.destroy();

                            const { data } = await this.model.make();
                            const { rewardFlag, reward } = data;

                            if (this.actTotalCount === 0) {
                                this.tutorial({ state: CoonyangMain.MissionState.END }).then();
                            } else {
                                this.main({ state: CoonyangMain.MissionState.END, rewardFlag, reward }).then();
                            }
                        },
                    });
                }
            },
        });

        this.dialog = new CoonyangDialog({
            scenario: [
                {
                    text: "뭐 하는 거야? 어서 딸기에 꾹꾹이 진행시켜!",
                    profileName: "coo_normal",
                },
            ],
        });
    }

    async rewardPopup({ reward }) {
        this.view.openRewardPopup({ reward });
        this.view.addEventRewardPopup({
            callback: () => {
                this.dialog.destroy();
                this.render().then();
            },
        });

        await delay(300);
        this.view.startSpinningSlot();
    }
}

class CoonyangSheet {
    option = {
        hasHeader: false,
        removedOnClose: true,
        displaySpeed: 0.3,
        displayDuration: 0,
        dimmed: false,
        dimmedClose: false,
    };

    constructor() {
        this.generate();
        this.addEvent();
        this.open();
    }

    generate() {
        this.sheet = bottomSheet.set(this.option).setBody(
            sheetTemplate.commonNudging({
                variableIcon: `
                        <div class="coonyang-sheet">
                            <img class="logo" src="https://crcf.cookatmarket.com/assets/mobile/img/coonyang/logo.png" alt="쿠냥이의 부탁">
                            <div class="jam-box">
                                <img class="jam" src="https://crcf.cookatmarket.com/assets/mobile/img/coonyang/jam_lv_4.png" alt="">
                                <img class="deco" src="https://crcf.cookatmarket.com/assets/mobile/img/coonyang/berry_small.png" alt="">
                                <img class="coin" src="https://crcf.cookatmarket.com/assets/mobile/img/coonyang/gnb/gage_icon.png" alt="">
                                <img class="rotated-shine" src="https://crcf.cookatmarket.com/assets/mobile/img/frequency/my_badge/rotated_shine.png" alt="">
                                <img class="effect-1 effect" src="https://crcf.cookatmarket.com/assets/mobile/img/coonyang/effect/effect_yellow_1.png" alt="">
                                <img class="effect-2 effect" src="https://crcf.cookatmarket.com/assets/mobile/img/coonyang/effect/effect_yellow_2.png" alt="">
                                <img class="effect-3 effect" src="https://crcf.cookatmarket.com/assets/mobile/img/coonyang/effect/effect_yellow_3.png" alt="">
                            </div>
                        </div>
                    `,
                title: "안녕! 나 잊은 거 아니지?",
                subtitle: `
                        화려한 꾹꾹이로 딸기잼 만들고 수고비로<br>적립금도 받아 가라구!
                    `,
                okayBtnText: "딸기잼 만들러 가기",
                cancelBtnText: "나중에 할게요",
            }),
        );
    }

    addEvent() {
        const sheetElement = this.sheet.getElement().sheet();

        const okayBtnElement = sheetElement.querySelector(".okay-btn");
        if (okayBtnElement) {
            okayBtnElement.addEventListener("click", () => {
                location.href = "/ko/frequency/coonyang";
            });
        }

        const closeBtnElement = sheetElement.querySelector(".cancel-btn");
        if (closeBtnElement) {
            this.sheet.addCloser(closeBtnElement, () => {});
        }
    }

    open() {
        this.sheet.open();
    }
}

class CoonyangView {
    $template = $(CoonyangMain.templateSelector);
    $view = $(CoonyangMain.templateSelector).find("#coonyang_view");

    constructor({}) {
        this.generate = new CoonyangGenerate({});
    }

    /**
     * #init_loading은 csr 렌더 전 화면을 부드럽게 보여주기 위해 view.php에 미리 세팅되어 있음
     */
    removeInitLoading() {
        this.$template.find("#init_loading").remove();
    }

    updateDuringLoading(state) {
        if (state) {
            this.$template.append(this.generate.duringLoading());
        } else {
            this.$template.find("#during_loading").remove();
        }
    }

    /**
     * GNB 타입 변경
     * @param type "back" | "none" | "all"
     */
    updateGNBType(type) {
        this.$template.find("#coonyang_gnb").attr("data-type", type);
    }

    /**
     * GNB 레벨 게이지 업데이트
     * @param level 0 ~ 4
     * @param isAnimate boolean
     */
    updateGNBLevelGage({ level = 0, isAnimate = false }) {
        const $gageLevel = this.$template.find("#coonyang_gnb .gage .level");

        const goalPercent = `calc(${-100 + level * 25}%${level === 1 ? "" : " - 2px"})`;

        if (isAnimate) {
            $gageLevel.css({ transform: `translateX(${-100 + (level - 1 >= 0 ? level - 1 : 0) * 25}%)`, transition: "transform 1s" });
            setTimeout(() => {
                $gageLevel.css({ transform: `translateX(${goalPercent})` });
            }, 200);
        } else {
            $gageLevel.css({ transform: `translateX(${goalPercent})` });
        }
    }

    resetView() {
        this.$view.html("");
    }

    /**
     * 화면 타입 설정
     * @param type 1|2|3 ...
     * 스타일에 따라 view Element data-type 속성을 변경하여 화면 타입을 설정
     */
    setViewType(type) {
        this.$view.attr("data-type", type);
    }

    mountViewConversation() {
        this.setViewType(1);
        this.$view.html(this.generate.conversation());
    }
    /**
     * 쿠냥이와 유저의 대화중 필요한 부분의 이미지 변수만 사용하여 업데이트. 소스 가독성을 위해 이미지 경로를 통일하여 파일명으로만 구분
     * @param userSpeech
     * @param userFace
     * @param kuSpeech
     * @param kuFace
     * @param speechingNow "ku" | "user"
     */
    updateConversationCat({ userSpeech = null, userFace = null, kuSpeech = null, kuFace = null, speechingNow = null }) {
        const imageBasePath = "https://crcf.cookatmarket.com/assets/mobile/img/coonyang/conversation/";

        const $catConversation = this.$view.find(".cat-conversation");

        const mappingElements = {
            "#ku_face": kuFace,
            "#user_face": userFace,
            "#ku_speech": kuSpeech,
            "#user_speech": userSpeech,
        };
        Object.entries(mappingElements).forEach(([selector, imageName]) => {
            if (imageName) {
                $catConversation.find(selector).attr("src", imageBasePath + imageName);
            }
        });

        $(".speeching-now").removeClass("speeching-now");
        if (speechingNow) {
            $catConversation.find(`#${speechingNow}_face`).addClass("speeching-now");
        }
    }

    mountViewCreateUserName({ text, selectEvent, otherEvent }) {
        this.setViewType(1);
        this.$view.html(this.generate.createUserName({ text }));
        this.addEventCreateUserName({ selectEvent, otherEvent });
    }
    updateViewCreateUserName({ text }) {
        this.$view.find(".my-name-text").html(text);
    }
    addEventCreateUserName({ selectEvent, otherEvent }) {
        const $cta = this.$view.find(".create-user-name-form .cta");

        $cta.find(".select").click(() => {
            selectEvent();
        });
        $cta.find(".other").click(() => {
            otherEvent();
        });
    }

    mountViewMission({ actCount = 0, makeAvailableSeconds = 0 }) {
        this.setViewType(2);
        this.$view.html(this.generate.mission({ actCount, makeAvailableSeconds }));
        this.updateToMakeJamButton(makeAvailableSeconds);

        if (makeAvailableSeconds > 0) {
            this.addEventMissionPossibleTimer(makeAvailableSeconds);
        }
    }
    updateToMakeJamButton(makeAvailableSeconds) {
        const $toMakeJamButton = this.$view.find(".jam-mission .cta .to-make-jam");

        if (makeAvailableSeconds === 0) {
            $toMakeJamButton.attr("disabled", false);
            $toMakeJamButton.html("딸기잼 만들기");
        } else {
            $toMakeJamButton.attr("disabled", true);
            $toMakeJamButton.html(`젤리 열 식히는 중<br><span class="waiting-time"></span>`);
        }
    }
    updateTutorialDimmed(state) {
        const $cta = this.$view.find(".jam-mission .cta");

        if (state) {
            this.$view.append(this.generate.tutorialDimmed());
            $cta.addClass("trace");
        } else {
            this.$view.find(".tutorial-dimmed").remove();
            $cta.removeClass("trace");
        }
    }
    addEventMissionPossibleTimer(makeAvailableSeconds) {
        if (makeAvailableSeconds === 0) {
            return;
        }

        const $waitingTime = this.$view.find(".to-make-jam span.waiting-time");

        let timerInterval = null;

        const checkRemainingTime = () => {
            const { hours, minutes, seconds } = dateUtil.getRemainingTime(makeAvailableSeconds);

            if (makeAvailableSeconds <= 0) {
                clearInterval(timerInterval);
                this.updateToMakeJamButton(makeAvailableSeconds);
            } else {
                function getRemainingTimeText({ hours, minutes, seconds }) {
                    function formatTime(time) {
                        return time < 10 ? `0${time}` : time;
                    }
                    return `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
                }

                $waitingTime.text(getRemainingTimeText({ hours, minutes, seconds }));

                makeAvailableSeconds--;
            }
        };

        checkRemainingTime();
        timerInterval = setInterval(() => {
            checkRemainingTime();
        }, 1000);
    }
    addEventMission({ toMakeJamEvent }) {
        const $cta = this.$view.find(".jam-mission .cta");

        $cta.find(".to-make-jam").click(() => {
            toMakeJamEvent();
        });
    }

    mountViewTouch({}) {
        this.setViewType(3);
        this.$view.html(this.generate.touch({}));
    }

    /**
     * @param state "start" | "touch" | "complete" - 터치 화면 상태 변경
     */
    updateTouchState({ state = CoonyangMain.TouchState.TOUCH }) {
        const $touchWrap = this.$view.find(".touch-wrap");

        $touchWrap.find(".touch-state-banner").remove();
        if (state !== "touch") {
            $touchWrap.append(`<div class="touch-state-banner ${state}">${state === CoonyangMain.TouchState.START ? "터치" : "완료"}</div>`);
            if (state === "complete") {
                $touchWrap.append(this.generate.twinklingEffect());
                $touchWrap.find(".touch-berry").remove();
            }
        }
    }
    addEventTouch({ touchEvent }) {
        const $touchWrap = this.$view.find(".touch-wrap");
        const $berryImg = $touchWrap.find(".berry-img");

        $touchWrap.find(".touch-berry").click((event) => {
            touchEvent();

            $berryImg.addClass("touching");

            setTimeout(() => {
                $berryImg.removeClass("touching");
            }, 500);

            const offset = [event.offsetX, event.offsetY];

            const $touchEffect = $('<div class="touch-effect"></div>');

            function getRandomPoint() {
                const randomNum = Math.floor(Math.random() * 100);
                return randomNum - 50;
            }

            $touchEffect.css({ left: offset[0], top: offset[1], transform: `translateY(${getRandomPoint() - 50}%) translateX(${getRandomPoint() - 50}%) rotate(${getRandomPoint()}deg)` });

            $touchWrap.append($touchEffect);
            setTimeout(function () {
                $touchEffect.remove();
            }, 2000);
        });
    }

    openRewardPopup({ reward = null }) {
        const points = [
            {
                amount: 10,
                text: "도와줘서 고마워…!<br>여기 수고비를 받아줘!",
            },
            {
                amount: 100,
                text: "이제 찹쌀떡을 만들 수 있겠군!<br>다음에도 도와줄 거지?",
            },
            {
                amount: 500,
                text: "야호, 맛있는 잼이 완성됐어!<br>너 정말 꾹꾹이에 소질 있구나?!",
            },
            {
                amount: 1000,
                text: "이렇게 맛있는 잼은 처음이야!<br>너 발바닥에 설탕 발랐니?",
            },
            {
                amount: 30000,
                text: "이건… 정말 환상의 맛이야…!<br>제발 다음에 또 만들어줘!!",
            },
        ];

        let rewordText = "";

        points.forEach((item) => {
            if (item.amount === reward) {
                item.isPick = true;

                rewordText = item.text;
            } else {
                item.isPick = false;
            }
        });

        this.$template.append(this.generate.rewardPopup({ points, rewordText, reward }));
    }
    addEventRewardPopup({ callback = () => {} }) {
        const $rewardPopup = this.$template.find("#coonyang_reward_popup");
        $rewardPopup.find(".cta button").click(() => {
            $rewardPopup.remove();
            callback();
        });
    }
    startSpinningSlot() {
        const $slot = this.$template.find("#coonyang_reward_popup .slot");
        const $pickSlot = $slot.find(".item.pick");

        const distance = $pickSlot.index() * $pickSlot.height() * -1;

        $slot.css({
            transform: `translateY(${distance}px)`,
            transition: `transform ${4000}ms cubic-bezier(0, 0, 0.4, 1.15)`,
        });
    }
}

class CoonyangGenerate {
    conversation() {
        return `
            <div class="cat-conversation">
                <div class="row row-speech">
                    <div class="col"><img id="ku_speech" src="https://crcf.cookatmarket.com/assets/mobile/img/coonyang/conversation/speech_shout.png" alt="말풍선 이미지"></div>
                    <div class="col"><img id="user_speech" src="https://crcf.cookatmarket.com/assets/mobile/img/coonyang/conversation/speech_normal.png" alt="말풍선 이미지"></div>
                </div>
                <div class="row row-cat">
                    <div class="col">
                        <img id="ku_face" src="https://crcf.cookatmarket.com/assets/mobile/img/coonyang/conversation/cookat_face_side.png" alt="고양이 얼굴">
                    </div>
                    <div class="col">
                        <img id="user_face" src="https://crcf.cookatmarket.com/assets/mobile/img/coonyang/conversation/user_face_side.png" alt="고양이 얼굴">
                    </div>
                </div>
            </div>
        `;
    }
    createUserName({ text }) {
        return `
            <div class="create-user-name-form">
                <div class="my-name-text">${text}</div>
                <img class="face-icon speeching-now" src="https://crcf.cookatmarket.com/assets/mobile/img/coonyang/conversation/user_face_side.png" alt="고양이 얼굴">
                <div class="cta">
                    <button class="select" type="button">마음에 들어요</button>
                    <button class="other" type="button">랜덤 추천받기</button>
                </div>
            </div>
        `;
    }

    duringLoading() {
        return `
            <div id="during_loading" class="loading-state">
                <div class="foot-loading">
                    <img src="https://crcf.cookatmarket.com/assets/mobile/img/coonyang/foot.png" alt="젤리 예열 중...">
                    <p>젤리 예열 중...</p>
                </div>
            </div>
        `;
    }

    tutorialDimmed() {
        return `<div class="tutorial-dimmed"></div>`;
    }

    mission({ actCount }) {
        return `
            <div class="jam-mission">
                <div>
                    <div class="jam">
                        <img class="bottle" src="https://crcf.cookatmarket.com/assets/mobile/img/coonyang/jam_lv_${actCount}.png" alt="잼 ${actCount}/4">
                        <img class="deco" src="https://crcf.cookatmarket.com/assets/mobile/img/coonyang/berry_small.png" alt="">
                    </div>
                    <div class="cta">
                        <button class="to-make-jam" type="button"></button>
                    </div>
                </div>
            </div>
        `;
    }

    touch({}) {
        return `
            <div class="touch-wrap">
                <img class="berry-img" src="https://crcf.cookatmarket.com/assets/mobile/img/coonyang/berry_xl.png" alt="딸기 클릭">
                <button class="touch-berry" type="button">딸기 클릭(꾹꾹이)</button>
            </div>
        `;
    }

    twinklingEffect() {
        return `
            <div class="twinkling-effect">
                <img class="effect effect-1" src="https://crcf.cookatmarket.com/assets/mobile/img/coonyang/effect/effect_white_1.png" alt="">
                <img class="effect effect-2" src="https://crcf.cookatmarket.com/assets/mobile/img/coonyang/effect/effect_white_2.png" alt="">
                <img class="effect effect-3" src="https://crcf.cookatmarket.com/assets/mobile/img/coonyang/effect/effect_white_3.png" alt="">
            </div>
        `;
    }

    rewardPopup(props) {
        const createSlotItems = () => {
            const repeatCount = 5;
            let html = "";

            for (let i = 1; i <= repeatCount; i++) {
                html += props.points
                    .map(
                        (item, index) => `
                        <div class="item ${i === repeatCount && item.isPick ? "pick" : ""}"><span>${numberFormat(item.amount)}</span><span>원</span></div>
                    `,
                    )
                    .join("");
            }

            return html;
        };

        return `
            <div id="coonyang_reward_popup" class="reward-full-popup">
                <div class="head">
                    <p>${props.rewordText ?? ""}</p>
                </div>
                <div class="content">
                    <div>
                        <h2>적립금 ${props.reword ? props.reword : 10}원 획득</h2>
                        <img class="label-img" src="https://crcf.cookatmarket.com/assets/mobile/img/coonyang/jam_label.png" alt="잼 완성">
                        <div class="shining-jam-bottle">
                            <img class="rotated-shine" src="https://crcf.cookatmarket.com/assets/mobile/img/frequency/my_badge/rotated_shine.png" alt="후광 효과">
                            <img class="jam-img" src="https://crcf.cookatmarket.com/assets/mobile/img/coonyang/jam_lv_4.png" alt="잼 병">
                            <div class="shining-effect">
                                <img class="effect effect-1" src="https://crcf.cookatmarket.com/assets/mobile/img/coonyang/effect/effect_yellow_1.png" alt="">
                                <img class="effect effect-2" src="https://crcf.cookatmarket.com/assets/mobile/img/coonyang/effect/effect_yellow_3.png" alt="">
                                <img class="effect effect-3" src="https://crcf.cookatmarket.com/assets/mobile/img/coonyang/effect/effect_yellow_2.png" alt="">
                            </div>
                        </div>
                        <div class="reward-point">
                            <img class="point-img" src="https://crcf.cookatmarket.com/assets/mobile/img/coonyang/gnb/gage_icon.png" alt="포인트">
                            <div class="point-slot">
                                <div class="slot spinning">
                                    ${createSlotItems()}
                                </div>
                            </div>
                        </div>
                        <div class="cta">
                            <button type="button">적립금 받기</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

/**
 * @param scenario
 * @param finishCallback
 */
class CoonyangDialog {
    $template = $(CoonyangMain.templateSelector);

    scenario = [];
    dialogId = "coonyang_dialog";
    profileName = "coo_normal";
    typingDelay = 100;
    currentScenarioIndex = 0; // 현재 실행중인 대화의 인덱스
    isCurrentEnd = false; // 현재 실행중인 대화의 종료 여부 (시나리오의 종료 여부가 아님)
    isLast = false; // 모든 시나리오 종료 여부

    /**
     *
     * @param scenario { text: string, profileName: string, ?callback: function, ?isLast: boolean } - callback: 해당 대화가 실행될 때 동시에 실행되는 함수
     * @param finishCallback { function } - 대화 시나리오 전체가 다 종료되면 실행할 함수
     */
    constructor({ scenario, finishCallback = () => {} }) {
        this.finishCallback = finishCallback;
        this.scenario = scenario;

        this.mount();
    }

    mount() {
        this.$template.append(this.generate());
        this.$dialogBox = $(`#${this.dialogId}`);

        this.addNextButtonEvent();

        this.nextScenario();
    }

    update({ text, profileName, callback, isLast = false }) {
        clearInterval(this.typingInterval);

        this.isCurrentEnd = false;
        this.text = text;
        this.isLast = isLast;

        this.typing();

        if (!isEmpty(profileName) && profileName !== this.profileName) {
            this.profileName = profileName;
            this.$dialogBox.find(".dialog-profile").html(`<img src="${this.getProfileUrl(this.profileName)}" alt="고양이 이미지">`);
        }

        if (typeof callback === "function") {
            callback();
        }
    }

    nextScenario() {
        if (this.currentScenarioIndex < this.scenario.length) {
            this.update(this.scenario[this.currentScenarioIndex]);

            this.currentScenarioIndex++;
        } else {
            this.finishCallback();
        }
    }

    typing() {
        this.setTypingStatus({ setState: "init" });

        const $dialogText = this.$dialogBox.find(".dialog-text");

        let index = 0;

        this.typingInterval = setInterval(() => {
            if (index < this.text.length) {
                $dialogText.append(this.text.charAt(index));
                index++;
            } else {
                this.setTypingStatus({ setState: "end" });
            }
        }, this.typingDelay);
    }

    /**
     * 타이핑 상태 설정
     * @param setState "init" | "end"
     * init: 대화창 텍스트를 초기화하고 타이핑 시작 지점으로 설정
     * end: 타이핑 종료하고 연관된 상태 설정
     */
    setTypingStatus({ setState }) {
        this.isCurrentEnd = setState === "end";
        this.$dialogBox.find(".dialog-text").html(setState === "end" ? this.text : "");

        if (setState === "end") {
            clearInterval(this.typingInterval);
            if (!this.isLast) {
                this.$dialogBox.find(".dialog-next").addClass("on");
            }
        } else {
            this.$dialogBox.find(".dialog-next").removeClass("on");
        }
    }

    getProfileUrl(name) {
        return `https://crcf.cookatmarket.com/assets/mobile/img/coonyang/dialog/${name}.png`;
    }

    addNextButtonEvent() {
        $(`#${this.dialogId}`)
            .find(".dialog-next")
            .click(() => {
                if (this.isCurrentEnd) {
                    this.nextScenario();
                } else {
                    this.setTypingStatus({ setState: "end" });
                }
            });
    }

    generate() {
        return `
            <div id="${this.dialogId}" class="dialog-box">
                <div class="dialog-content">
                    <div class="dialog-profile"><img src="${this.getProfileUrl(this.profileName)}" alt="고양이 얼굴"></div>
                    <div class="dialog-text"><!-- update --></div>
                </div>
                <button class="dialog-next" type="button">다음</button>
            </div>
        `;
    }

    destroy() {
        this.$dialogBox.remove();
    }
}

class CoonyangModel {
    constructor() {}

    async info() {
        const response = await this.callAPI("/v2/jam_makers/info", {});
        return { ...response };
    }

    async join(aka) {
        const response = await this.callAPI("/v2/jam_makers/join", {
            aka,
        });
        return { ...response };
    }

    async make() {
        const response = await this.callAPI("/v2/jam_makers/make", {});
        return { ...response };
    }

    async recommend() {
        const response = await this.callAPI("/v2/jam_makers/recommend", {});
        return { ...response };
    }

    callAPI(action, formData) {
        if (!action || !formData) {
            console.error("params not defined >>>> action / formData");
            return false;
        }
        return new Promise((resolve, reject) => {
            ajaxHandler(null, {
                action,
                formData,
                async: true,
                successFunc: (response) => {
                    console.log(response);
                    resolve(response);
                },
                errorFunc: (e) => {
                    reject(e);
                },
            });
        });
    }
}
