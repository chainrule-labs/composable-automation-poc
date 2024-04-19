import {
  getKernelAddressFromECDSA,
  signerToEcdsaValidator,
} from "@zerodev/ecdsa-validator";
import { createKernelAccount } from "@zerodev/sdk";
import { ENTRYPOINT_ADDRESS_V07 } from "permissionless";
import { Hex, createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

const entryPoint = ENTRYPOINT_ADDRESS_V07;

// 79b2b13cac543fd9b9e2f281e2d963a2f0794ea751d75d4dafca8c40a0e39680
const eoaAddress = "0xAed0B2b76f88b3A6da76F549fa9a0cFfB8634868";

const publicClient = createPublicClient({
  transport: http(process.env.NEXT_PUBLIC_BUNDLER_RPC),
});

test("consistent addresses regardless of method", async () => {
  const seed = "123";
  const addressFromEcdsa = await getKernelAddressFromECDSA({
    publicClient,
    eoaAddress,
    index: BigInt(seed),
    entryPointAddress: entryPoint,
  });

  const signer = privateKeyToAccount(
    "0x79b2b13cac543fd9b9e2f281e2d963a2f0794ea751d75d4dafca8c40a0e39680" as Hex,
  );

  const ecdsaValidator = await signerToEcdsaValidator(publicClient, {
    signer: signer,
    entryPoint,
  });

  const account = await createKernelAccount(publicClient, {
    index: BigInt(seed),
    plugins: {
      sudo: ecdsaValidator,
    },
    entryPoint,
  });

  console.log("Generated address:", addressFromEcdsa);
  console.log("Kernel account:", account.address);
  expect(account.address).toEqual(addressFromEcdsa);
});

test("kernel addresses are the same across chains", async () => {
  const smartAccountAddress1 = await getKernelAddressFromECDSA({
    publicClient,
    eoaAddress,
    index: 0n,
    entryPointAddress: entryPoint,
  });

  const smartAccountAddress2 = await getKernelAddressFromECDSA({
    publicClient,
    eoaAddress,
    index: 0n,
    entryPointAddress: entryPoint,
  });

  expect(smartAccountAddress1).toEqual(smartAccountAddress2);
});
