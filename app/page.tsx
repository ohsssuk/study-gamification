import Header from "@/components/coonyang/Header";
import Wrap from "@/components/coonyang/Wrap";
import { GnbTypeEnum } from "@/enums/coonyang";

import "./coonyang.css";
import InitLoading from "@/components/coonyang/InitLoading";
import Main from "@/components/coonyang/Main";

export default function Home() {
  return (
    <Wrap>
      {/* <InitLoading /> */}
      <Header level={0} type={GnbTypeEnum.All} />
      <Main />
    </Wrap>
  );
}
