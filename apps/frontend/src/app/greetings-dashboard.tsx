"use client";

import {
  COUNTRY_CODES,
  type CountryCode,
  type CreateGreetingPayload,
  type Greeting,
} from "@fullstack-demo/contracts/greetings";
import { FormEvent, useCallback, useEffect, useState } from "react";
import styled, { css } from "styled-components";

type SortOrder = "asc" | "desc";

const DEFAULT_API_URL = "http://localhost:3001";
const apiBase =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? DEFAULT_API_URL;
const API_BASE = apiBase;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY ?? "my-secret-key";

export function GreetingsDashboard() {
  const [greetings, setGreetings] = useState<Greeting[]>([]);
  const [listStatus, setListStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [listError, setListError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [flashMessage, setFlashMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [content, setContent] = useState("");
  const [countryCode, setCountryCode] = useState<CountryCode>(
    COUNTRY_CODES[0]
  );
  const [createError, setCreateError] = useState<string | null>(null);
  const [createStatus, setCreateStatus] = useState<"idle" | "submitting">(
    "idle"
  );

  const [lookupId, setLookupId] = useState("");
  const [lookupStatus, setLookupStatus] = useState<
    "idle" | "loading" | "error"
  >("idle");
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [lookupResult, setLookupResult] = useState<Greeting | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const greetingsEndpoint = `${API_BASE}/greetings`;

  const fetchGreetings = useCallback(
    async (order: SortOrder) => {
      const res = await fetch(`${greetingsEndpoint}?sort=${order}`);
      if (!res.ok) {
        throw new Error(`Failed to load greetings (status ${res.status})`);
      }
      const payload = (await res.json()) as Greeting[];
      return payload.map((item) => ({
        ...item,
        createdAt: item.createdAt ?? new Date().toISOString(),
      }));
    },
    [greetingsEndpoint]
  );

  const refreshGreetings = useCallback(
    async (order: SortOrder, opts?: { silent?: boolean }) => {
      const silent = opts?.silent ?? false;
      if (silent) {
        setIsRefreshing(true);
      } else {
        setListStatus("loading");
        setListError(null);
      }
      try {
        const data = await fetchGreetings(order);
        setGreetings(data);
        setListStatus("ready");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        setListError(message);
        setListStatus("error");
      } finally {
        if (silent) {
          setIsRefreshing(false);
        }
      }
    },
    [fetchGreetings]
  );

  useEffect(() => {
    void refreshGreetings(sortOrder);
  }, [refreshGreetings, sortOrder]);

  const handleLookupById = useCallback(
    async (id: string) => {
      if (!id) {
        setLookupError("Provide a greeting id");
        setLookupStatus("error");
        setLookupResult(null);
        return;
      }
      setLookupStatus("loading");
      setLookupError(null);
      setFlashMessage(null);
      try {
        const res = await fetch(`${greetingsEndpoint}/${id}`);
        if (res.status === 404) {
          setLookupResult(null);
          setLookupStatus("error");
          setLookupError("Greeting not found");
          return;
        }
        if (!res.ok) {
          throw new Error(`Lookup failed (status ${res.status})`);
        }
        const payload = (await res.json()) as Greeting;
        setLookupResult(payload);
        setLookupStatus("idle");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown lookup error";
        setLookupError(message);
        setLookupStatus("error");
        setLookupResult(null);
      }
    },
    [greetingsEndpoint]
  );

  const handleCreate = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!content.trim()) {
        setCreateError("Content is required");
        return;
      }
      setCreateError(null);
      setFlashMessage(null);
      setCreateStatus("submitting");
      try {
        const payload: CreateGreetingPayload = {
          content: content.trim(),
          countryCode,
        };
        const res = await fetch(greetingsEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
          },
          body: JSON.stringify(payload),
        });

        if (res.status === 403) {
          throw new Error("Invalid API key. Check NEXT_PUBLIC_API_KEY.");
        }
        if (!res.ok) {
          throw new Error(`Failed to create greeting (status ${res.status})`);
        }

        const insertedId = (await res.text()).replace(/"/g, "").trim();
        setContent("");
        setCountryCode(COUNTRY_CODES[0]);
        setFlashMessage({
          type: "success",
          message: `Created greeting ${insertedId}`,
        });
        await refreshGreetings(sortOrder, { silent: true });
        if (lookupResult?.id) {
          const shouldRefreshLookup = lookupResult.id === insertedId;
          if (shouldRefreshLookup) {
            await handleLookupById(insertedId);
          }
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to create greeting";
        setCreateError(message);
        setFlashMessage({ type: "error", message });
      } finally {
        setCreateStatus("idle");
      }
    },
    [
      content,
      countryCode,
      greetingsEndpoint,
      handleLookupById,
      lookupResult,
      refreshGreetings,
      sortOrder,
    ]
  );

  const handleLookupSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      await handleLookupById(lookupId.trim());
    },
    [handleLookupById, lookupId]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      setDeletingId(id);
      setFlashMessage(null);
      try {
        const res = await fetch(`${greetingsEndpoint}/${id}`, {
          method: "DELETE",
          headers: {
            "X-API-KEY": API_KEY,
          },
        });
        if (res.status === 404) {
          throw new Error("Greeting not found. It may have been removed.");
        }
        if (res.status === 403) {
          throw new Error("Invalid API key. Check NEXT_PUBLIC_API_KEY.");
        }
        if (!res.ok) {
          throw new Error(`Failed to delete greeting (status ${res.status})`);
        }
        setFlashMessage({
          type: "success",
          message: `Deleted greeting ${id}`,
        });
        await refreshGreetings(sortOrder, { silent: true });
        if (lookupResult?.id === id) {
          setLookupResult(null);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to delete greeting";
        setFlashMessage({ type: "error", message });
      } finally {
        setDeletingId(null);
      }
    },
    [greetingsEndpoint, lookupResult, refreshGreetings, sortOrder]
  );

  const hasGreetings = greetings.length > 0;

  return (
    <DashboardContainer>
      <DashboardInner>
        <DashboardHeader>
          <DashboardTitle>Greetings playground</DashboardTitle>
          <DashboardSubtitle>
            Interact with the NestJS greetings API: list, create, find, and delete greetings.
            Protect mutations with <InlineCode>X-API-KEY</InlineCode>.
          </DashboardSubtitle>
        </DashboardHeader>

        {flashMessage && (
          <FlashMessage $variant={flashMessage.type}>
            {flashMessage.message}
          </FlashMessage>
        )}

        <SectionCard>
          <SectionTitle>Create greeting</SectionTitle>
          <Form onSubmit={handleCreate} noValidate>
            <FieldLabel>
              <LabelHeading>Message</LabelHeading>
              <TextInput
                placeholder="Say hello!"
                value={content}
                onChange={(event) => setContent(event.target.value)}
              />
            </FieldLabel>

            <FieldLabel>
              <LabelHeading>Country</LabelHeading>
              <SelectInput
                value={countryCode}
                onChange={(event) =>
                  setCountryCode(event.target.value as CountryCode)
                }
              >
                {COUNTRY_CODES.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </SelectInput>
            </FieldLabel>

            {createError && <ErrorText>{createError}</ErrorText>}

            <PrimaryButton type="submit" disabled={createStatus === "submitting"}>
              {createStatus === "submitting" ? "Saving…" : "Create greeting"}
            </PrimaryButton>
          </Form>
        </SectionCard>

        <SectionCard>
          <SectionTitle>Lookup by id</SectionTitle>
          <LookupForm onSubmit={handleLookupSubmit}>
            <LookupInput
              placeholder="Enter greeting id"
              value={lookupId}
              onChange={(event) => setLookupId(event.target.value)}
            />
            <LookupButton type="submit" disabled={lookupStatus === "loading"}>
              {lookupStatus === "loading" ? "Searching…" : "Find greeting"}
            </LookupButton>
          </LookupForm>
          {lookupError && <ErrorText>{lookupError}</ErrorText>}
          {lookupResult && (
            <LookupResult>
              <p>
                <Emphasis>Message:</Emphasis> {lookupResult.content}
              </p>
              <p>
                <Emphasis>Country:</Emphasis> {lookupResult.countryCode}
              </p>
              <p>
                <Emphasis>Created:</Emphasis>{" "}
                {new Date(lookupResult.createdAt).toLocaleString()}
              </p>
              <p>
                <Emphasis>Id:</Emphasis> <Identifier>{lookupResult.id}</Identifier>
              </p>
            </LookupResult>
          )}
        </SectionCard>

        <SectionCard>
          <SectionHeaderRow>
            <SectionHeaderText>
              <SectionTitle as="h3">All greetings</SectionTitle>
              <SectionDescription>
                Sorted by creation time. Use actions above to add or remove greetings.
              </SectionDescription>
            </SectionHeaderText>
            <SortControls>
              <SortLabel htmlFor="sort-order">Sort:</SortLabel>
              <SortSelect
                id="sort-order"
                value={sortOrder}
                onChange={(event) => {
                  const next = event.target.value as SortOrder;
                  setSortOrder(next);
                }}
              >
                <option value="desc">Newest first</option>
                <option value="asc">Oldest first</option>
              </SortSelect>
              <SecondaryButton
                type="button"
                onClick={() => refreshGreetings(sortOrder, { silent: true })}
                disabled={isRefreshing}
              >
                {isRefreshing ? "Refreshing…" : "Refresh"}
              </SecondaryButton>
            </SortControls>
          </SectionHeaderRow>

          {listStatus === "loading" && <MutedText>Loading greetings…</MutedText>}

          {listStatus === "error" && listError && <ErrorText>{listError}</ErrorText>}

          {listStatus === "ready" && !hasGreetings && (
            <MutedText>No greetings yet. Create one above!</MutedText>
          )}

          {listStatus === "ready" && hasGreetings && (
            <GreetingList>
              {greetings.map((greeting) => (
                <GreetingItem key={greeting.id}>
                  <GreetingItemHeader>
                    <GreetingTitle>{greeting.content}</GreetingTitle>
                    <DangerButton
                      type="button"
                      onClick={() => handleDelete(greeting.id)}
                      disabled={deletingId === greeting.id}
                    >
                      {deletingId === greeting.id ? "Deleting…" : "Delete"}
                    </DangerButton>
                  </GreetingItemHeader>
                  <GreetingMeta>
                    <MetaItem>
                      <MetaLabel>Id:</MetaLabel>
                      <MetaValue>{greeting.id}</MetaValue>
                    </MetaItem>
                    <MetaItem>
                      <MetaLabel>Country:</MetaLabel>
                      <MetaValue>{greeting.countryCode}</MetaValue>
                    </MetaItem>
                    <MetaItem>
                      <MetaLabel>Created:</MetaLabel>
                      <MetaValue>
                        {new Date(greeting.createdAt).toLocaleString()}
                      </MetaValue>
                    </MetaItem>
                  </GreetingMeta>
                </GreetingItem>
              ))}
            </GreetingList>
          )}
        </SectionCard>

        <FooterNote>
          Update <InlineCode>NEXT_PUBLIC_API_URL</InlineCode> and{" "}
          <InlineCode>NEXT_PUBLIC_API_KEY</InlineCode> in <InlineCode>.env.local</InlineCode> if
          your backend lives elsewhere or uses a different key.
        </FooterNote>
      </DashboardInner>
    </DashboardContainer>
  );
}

const DashboardContainer = styled.div`
  width: 100%;
  border-radius: 0.75rem;
  border: 1px solid #e4e4e7;
  background: #ffffff;
  padding: 1.5rem;
  box-shadow: 0 15px 40px rgba(15, 23, 42, 0.06);

  @media (min-width: 640px) {
    padding: 2rem;
  }

  @media (prefers-color-scheme: dark) {
    background: #0b0b0f;
    border-color: #27272a;
    box-shadow: none;
  }
`;

const DashboardInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const DashboardHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const DashboardTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  color: #18181b;

  @media (prefers-color-scheme: dark) {
    color: #fafafa;
  }
`;

const DashboardSubtitle = styled.p`
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

const FlashMessage = styled.div<{ $variant: "success" | "error" }>`
  border-radius: 0.75rem;
  border: 1px solid transparent;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;

  ${({ $variant }) =>
    $variant === "success"
      ? css`
          background: #ecfdf3;
          border-color: #bbf7d0;
          color: #047857;

          @media (prefers-color-scheme: dark) {
            background: rgba(16, 185, 129, 0.15);
            border-color: rgba(16, 185, 129, 0.4);
            color: #5eead4;
          }
        `
      : css`
          background: #fef2f2;
          border-color: #fecdd3;
          color: #b91c1c;

          @media (prefers-color-scheme: dark) {
            background: rgba(244, 63, 94, 0.12);
            border-color: rgba(244, 63, 94, 0.4);
            color: #fca5a5;
          }
        `};
`;

const SectionCard = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-radius: 0.75rem;
  border: 1px solid #e4e4e7;
  background: #ffffff;
  padding: 1rem;

  @media (prefers-color-scheme: dark) {
    border-color: #27272a;
    background: #09090b;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #18181b;

  @media (prefers-color-scheme: dark) {
    color: #fafafa;
  }
`;

const SectionDescription = styled.p`
  font-size: 0.875rem;
  color: #71717a;
  line-height: 1.5;

  @media (prefers-color-scheme: dark) {
    color: #d4d4d8;
  }
`;

const SectionHeaderRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const SectionHeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SortControls = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
`;

const SortLabel = styled.label`
  font-size: 0.875rem;
  color: #52525b;

  @media (prefers-color-scheme: dark) {
    color: #e4e4e7;
  }
`;

const baseFieldStyles = css`
  border-radius: 0.5rem;
  border: 1px solid #d4d4d8;
  background: #ffffff;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  color: #18181b;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: #3f3f46;
    outline: none;
    box-shadow: 0 0 0 2px rgba(63, 63, 70, 0.15);
  }

  @media (prefers-color-scheme: dark) {
    background: #0f1014;
    border-color: #3f3f46;
    color: #e4e4e7;

    &:focus {
      border-color: #a1a1aa;
      box-shadow: 0 0 0 2px rgba(161, 161, 170, 0.15);
    }
  }
`;

const TextInput = styled.input`
  width: 100%;
  ${baseFieldStyles};
`;

const SelectInput = styled.select`
  width: 100%;
  ${baseFieldStyles};
`;

const SortSelect = styled.select`
  ${baseFieldStyles};
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  width: auto;
`;

const buttonBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.5;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const PrimaryButton = styled.button`
  ${buttonBase};
  align-self: flex-start;
  background: #18181b;
  color: #ffffff;
  border: none;

  &:hover:not(:disabled) {
    background: #27272a;
  }

  &:focus-visible {
    outline: 2px solid #27272a;
    outline-offset: 2px;
  }

  @media (prefers-color-scheme: dark) {
    background: #fafafa;
    color: #09090b;

    &:hover:not(:disabled) {
      background: #e4e4e7;
    }

    &:focus-visible {
      outline-color: #d4d4d8;
    }
  }
`;

const LookupButton = styled(PrimaryButton)`
  @media (min-width: 640px) {
    align-self: flex-end;
  }
`;

const SecondaryButton = styled.button`
  ${buttonBase};
  background: transparent;
  border: 1px solid #d4d4d8;
  color: #52525b;

  &:hover:not(:disabled) {
    border-color: #27272a;
    color: #18181b;
  }

  &:focus-visible {
    outline: 2px solid #27272a;
    outline-offset: 2px;
  }

  @media (prefers-color-scheme: dark) {
    border-color: #3f3f46;
    color: #e4e4e7;

    &:hover:not(:disabled) {
      border-color: #a1a1aa;
      color: #fafafa;
    }

    &:focus-visible {
      outline-color: #a1a1aa;
    }
  }
`;

const DangerButton = styled(SecondaryButton)`
  border-color: #fca5a5;
  color: #b91c1c;
  font-size: 0.75rem;
  padding: 0.4rem 0.75rem;

  &:hover:not(:disabled) {
    border-color: #ef4444;
    color: #991b1b;
  }

  @media (prefers-color-scheme: dark) {
    border-color: rgba(248, 113, 113, 0.45);
    color: #fda4af;

    &:hover:not(:disabled) {
      border-color: rgba(248, 113, 113, 0.7);
      color: #fecdd3;
    }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const LookupForm = styled(Form)`
  @media (min-width: 640px) {
    flex-direction: row;
    align-items: flex-end;
  }
`;

const FieldLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #52525b;

  @media (prefers-color-scheme: dark) {
    color: #d4d4d8;
  }
`;

const LabelHeading = styled.span`
  font-weight: 600;
  color: #18181b;

  @media (prefers-color-scheme: dark) {
    color: #fafafa;
  }
`;

const LookupInput = styled(TextInput)`
  flex: 1 1 auto;
`;

const ErrorText = styled.p`
  font-size: 0.875rem;
  color: #b91c1c;

  @media (prefers-color-scheme: dark) {
    color: #fda4af;
  }
`;

const LookupResult = styled.div`
  border-radius: 0.75rem;
  border: 1px solid #e4e4e7;
  background: #f4f4f5;
  padding: 1rem;
  font-size: 0.875rem;
  color: #3f3f46;
  line-height: 1.5;

  @media (prefers-color-scheme: dark) {
    border-color: #27272a;
    background: #0f172a;
    color: #e2e8f0;
  }
`;

const Emphasis = styled.span`
  font-weight: 600;
`;

const Identifier = styled.span`
  word-break: break-word;
  overflow-wrap: anywhere;
`;

const MutedText = styled.p`
  font-size: 0.875rem;
  color: #71717a;

  @media (prefers-color-scheme: dark) {
    color: #a1a1aa;
  }
`;

const GreetingList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const GreetingItem = styled.li`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border-radius: 0.75rem;
  border: 1px solid #e4e4e7;
  padding: 1rem;
  font-size: 0.875rem;
  color: #3f3f46;

  @media (prefers-color-scheme: dark) {
    border-color: #27272a;
    color: #d4d4d8;
  }
`;

const GreetingItemHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const GreetingTitle = styled.p`
  font-size: 1rem;
  font-weight: 600;
  color: #18181b;

  @media (prefers-color-scheme: dark) {
    color: #fafafa;
  }
`;

const GreetingMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1rem;
  font-size: 0.75rem;
  color: #71717a;
  line-height: 1.4;

  @media (prefers-color-scheme: dark) {
    color: #a1a1aa;
  }
`;

const MetaItem = styled.span`
  display: inline-flex;
  gap: 0.25rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const MetaLabel = styled.span`
  font-weight: 600;
`;

const MetaValue = styled.span`
  text-transform: none;
  letter-spacing: normal;
  font-weight: 500;
  word-break: break-word;
`;

const FooterNote = styled.footer`
  font-size: 0.875rem;
  color: #71717a;
  line-height: 1.6;

  @media (prefers-color-scheme: dark) {
    color: #d4d4d8;
  }
`;
