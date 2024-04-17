"use client";

import { useConnectModal } from "@rainbow-me/rainbowkit";
import { setLocker } from "app/actions/setLocker";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount, useConfig } from "wagmi";

export default function DashboardNoLocker() {
  const { openConnectModal } = useConnectModal();
  const config = useConfig();
  const [isCreatingLocker, setIsCreatingLocker] = useState(false);
  const router = useRouter();
  const { isConnected, address, chain } = useAccount();

  const onCreateLocker = async () => {
    console.log("onCreateLocker", isConnected, address);
    setIsCreatingLocker(true);
    if (!isConnected && openConnectModal) {
      openConnectModal();
    }
  };

  const genLockerAddress = async () => {
    console.log("genLockerAddress", address);
    const lockerInfo = await setLocker(address);
    console.log("lockerInfo", lockerInfo);
    router.refresh();
  };
  useEffect(() => {
    console.log("trigger gen-address", address, isCreatingLocker);
    if (isCreatingLocker && address) {
      // generate locker address
      genLockerAddress();
    }
  }, [address, isCreatingLocker]);

  let createLockerButton = null;
  if (isCreatingLocker) {
    createLockerButton = (
      <button
        className="w-full rounded-lg bg-[#4C4FE4] py-2 text-white"
        disabled
      >
        Setting up Locker...
      </button>
    );
  } else {
    createLockerButton = (
      <button
        className="w-full rounded-lg bg-[#4C4FE4] py-2 text-white"
        onClick={onCreateLocker}
      >
        Create a Locker
      </button>
    );
  }

  return (
    <div className="xs:grid xs:place-content-center h-full w-full p-4">
      <div className="mb-12 flex flex-col space-y-4">
        <h1 className="font- w-full text-3xl font-normal">
          How does Locker work?
        </h1>
        <ol className="list-decimal space-y-4 pl-8 font-normal text-zinc-300">
          <li>Create a Locker for your savings.</li>
          <li>
            <span>
              Program your Locker so it knows what to do with future deposits.
              Here is an example program:
            </span>
            <ul className="mt-2 list-disc space-y-2 pl-8 font-normal text-zinc-300">
              <li>
                Swap 10% to ETH, stake it on Lido, and store the received stETH
                in the Locker.
              </li>
              <li>Swap 10% to WBTC and store it in the Locker.</li>
              <li>Deposit 10% into a Locker Pool to earn yield.</li>
              <li>
                Send the remaining 70% to Coinbase for off-ramping into fiat.
              </li>
            </ul>
          </li>
          <li>
            Tell your employer or clients to pay you at your Locker address.
          </li>
        </ol>
      </div>
      {createLockerButton}
    </div>
  );
}
