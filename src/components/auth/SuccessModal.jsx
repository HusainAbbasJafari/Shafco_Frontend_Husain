import { Button } from "../ui/button";
import { IoCheckmarkCircle } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { set } from "nprogress";
import { BsArrowRight } from "react-icons/bs";
import { useState } from "react";

const SuccessModal = ({ onSwitchTo, setOpenAuthModal }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const goToHomepage = () => {
    setIsSubmitting(true);
    setOpenAuthModal(false); // Close modal
    router.push("/");        // Redirect to homepage
  };

  return (
    <div className="flex flex-col items-center gap-6 py-10">
      <IoCheckmarkCircle className="text-green-600" size={60} />

      <h1 className="text-2xl font-semibold text-center">All Done!</h1>
      <p className="text-sm text-muted-foreground text-center">
        Your password has been successfully changed.
      </p>

      <Button
        onClick={goToHomepage}
        type="submit"
        className="w-full mt-2 flex justify-center items-center gap-2"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            Go to Homepage <BsArrowRight />
          </>
        )}
      </Button>
    </div>
  );
};

export default SuccessModal;
