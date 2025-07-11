import companyLogo from "@/public/images/logo-lg.png";
import { useTranslations } from "next-intl";
import Image from "next/image";

const ComingSoon = () => {

    const tg = useTranslations('general');

    return(
        <div className="bg-whitee">
            <div className="container h-[50vh] py-14">
                <div className="flex flex-col items-center justify-center h-full">
                    <Image src={companyLogo} width={200} height={120} alt="company-logo"  className="mb-4"/>
                    <p className="font-bold text-3xl">
                        {tg('comingSoon')}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ComingSoon