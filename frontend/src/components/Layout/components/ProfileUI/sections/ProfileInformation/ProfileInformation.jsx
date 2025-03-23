import {Divider} from 'antd';
import {
    AccountSecurity
} from "~/components/Layout/components/ProfileUI/sections/ProfileInformation/components/AccountSecurity";
import {
    VerifyInformation
} from "~/components/Layout/components/ProfileUI/sections/ProfileInformation/components/VerifyInfomation";
import {
    AccountInformation
} from "~/components/Layout/components/ProfileUI/sections/ProfileInformation/components/AccountInformation";

export const ProfileInformation = () => {
    return (
        <>
            {/*<AccountSecurity/>*/}
            {/*<Divider/>*/}
            {/*<VerifyInformation/>*/}
            {/*<Divider/>*/}
            <AccountInformation/>
        </>
    );
};