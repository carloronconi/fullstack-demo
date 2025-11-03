"use client";

import Image from "next/image";
import styled from "styled-components";

import { GreetingsDashboard } from "./greetings-dashboard";

const Shell = styled.main`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f4f4f5;
  padding: 0 1rem;

  @media (prefers-color-scheme: dark) {
    background: #050505;
    color: #fafafa;
  }
`;

const Content = styled.div`
  width: 100%;
  max-width: 48rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  padding: 4rem 1.5rem;

  @media (min-width: 640px) {
    padding-left: 3rem;
    padding-right: 3rem;
  }
`;

const Hero = styled.header`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: center;

  @media (min-width: 640px) {
    text-align: left;
  }
`;

const Logo = styled(Image)`
  height: auto;
  width: auto;
  filter: none;

  @media (prefers-color-scheme: dark) {
    filter: invert(1);
  }
`;

const Tagline = styled.p`
  font-size: 0.75rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #71717a;

  @media (prefers-color-scheme: dark) {
    color: #d4d4d8;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #18181b;

  @media (min-width: 640px) {
    font-size: 2.5rem;
  }

  @media (prefers-color-scheme: dark) {
    color: #fafafa;
  }
`;

const Description = styled.p`
  font-size: 1.0625rem;
  line-height: 1.65;
  color: #52525b;

  @media (prefers-color-scheme: dark) {
    color: #d4d4d8;
  }
`;

const InfoSection = styled.section`
  font-size: 0.875rem;
  color: #71717a;
  line-height: 1.6;

  @media (prefers-color-scheme: dark) {
    color: #d4d4d8;
  }
`;

const InlineCode = styled.code`
  display: inline-block;
  border-radius: 0.375rem;
  background: #f4f4f5;
  padding: 0.125rem 0.375rem;
  font-size: 0.75rem;
  color: #3f3f46;

  @media (prefers-color-scheme: dark) {
    background: #27272a;
    color: #e4e4e7;
  }
`;

export default function Home() {
  return (
    <Shell>
      <Content>
        <Hero>
          <Logo src="/next.svg" alt="Next.js logo" width={100} height={20} priority />
          <Tagline>Full-stack demo</Tagline>
          <Title>Next.js frontend + NestJS backend</Title>
          <Description>
            Use the dashboard below to exercise the NestJS greetings API — list greetings,
            create new ones, look them up, and delete them again.
          </Description>
        </Hero>

        <GreetingsDashboard />

        <InfoSection>
          <p>
            Run <InlineCode>pnpm dev:all</InlineCode> from the repository root to start both
            apps. The frontend expects the backend at{" "}
            <InlineCode>http://localhost:3001</InlineCode>; change{" "}
            <InlineCode>NEXT_PUBLIC_API_URL</InlineCode> and{" "}
            <InlineCode>NEXT_PUBLIC_API_KEY</InlineCode> if needed.
          </p>
        </InfoSection>
      </Content>
    </Shell>
  );
}
