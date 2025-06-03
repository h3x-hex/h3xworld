import * as React from 'react';
import { Html, Button, Section, Img, Text, Heading, Tailwind } from "@react-email/components";

interface EmailProps {
    url: string;
  }
  

export function EmailTemplate( {url} : EmailProps ) {

  return (
    <Html>
        <Tailwind>
            <Section align='center' className="my-[16px] mx-auto text-center items-center justify-center">
                <Img
                    alt="h3x logo"
                    className="w-full max-w-[400px] rounded-[12px] object-cover"
                    height="400"
                    src="https://firebasestorage.googleapis.com/v0/b/hexworld369888.appspot.com/o/h3x_logo.png?alt=media&token=edd9e8d0-cf93-4855-bdf6-22ec8407048d"
                />
                <Section className="mt-[32px] text-center">
                    <Heading
                        as="h1"
                        className="m-0 mt-[8px] text-[36px] font-semibold leading-[36px] text-black"
                    >
                        Welcome to h<span className='text-yellow-500 dark:text-yellow-500'>3</span>x.world!!!
                    </Heading>
                    <Text className="text-[16px] leading-[24px] text-black">
                        Welcome to h3x.world, a pioneering Web3 social media platform designed specifically for creators, artists, influencers, and entrepreneurs. Built on the principles of decentralization and blockchain technology, h3x.world empowers users to own and control their content, ensuring enhanced privacy and security. This innovative platform fosters a community-driven environment where users can express themselves freely, engage in peer-to-peer transactions, and monetize their creations through tokenized economies. By leveraging the power of Web3, h3x.world offers a unique space for collaboration, creativity, and growth, allowing users to build their digital presence without the constraints of traditional centralized platforms
                    </Text>
                    <Button
                        className="mt-[16px] rounded-[8px] bg-yellow-500 dark:bg-yellow-500 px-[40px] py-[12px] font-semibold text-black"
                        href={url}
                    >
                        Click here to verify.
                    </Button>
                </Section>
            </Section>
        </Tailwind>
    </Html>
  );
}