import type { ReactNode } from "react";

import {
  AlertTriangleIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CheckIcon,
  CloseIcon,
  Divider,
  Field,
  HelperText,
  InfoCircleIcon,
  Input,
  SearchIcon,
  Select,
  Skeleton,
  Stack,
  SparklesIcon,
  StatBox,
  Textarea,
} from "@fullstack-demo/design-system";

const buttonVariants = [
  "primary",
  "secondary",
  "outline",
  "ghost",
  "danger",
] as const;
const buttonSizes = ["xs", "sm", "md", "lg", "xl"] as const;
const countryOptions = ["US", "IT", "DE", "JP", "BR"];
const iconShowcase = [
  { name: "Sparkles", Icon: SparklesIcon },
  { name: "Arrow Right", Icon: ArrowRightIcon },
  { name: "Arrow Left", Icon: ArrowLeftIcon },
  { name: "Arrow Up", Icon: ArrowUpIcon },
  { name: "Arrow Down", Icon: ArrowDownIcon },
  { name: "Check", Icon: CheckIcon },
  { name: "Close", Icon: CloseIcon },
  { name: "Search", Icon: SearchIcon },
  { name: "Info Circle", Icon: InfoCircleIcon },
  { name: "Alert Triangle", Icon: AlertTriangleIcon },
] as const;

export default function DesignShowcasePage() {
  return (
    <div className="min-h-screen bg-surface text-foreground">
      <Stack
        gap="xl"
        className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10 lg:px-16"
      >
        <header className="flex flex-col gap-3">
          <Badge tone="brand" variant="soft" className="self-start">
            Design system
          </Badge>
          <Stack gap="xs">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Component library preview
            </h1>
            <p className="text-base text-muted">
              Browse the shared UI primitives with sample data to confirm their
              visual consistency.
            </p>
          </Stack>
        </header>

        <Stack gap="lg">
          <ShowcaseSection
            title="Buttons"
            description="Available variants and sizes with busy states."
          >
            <Stack direction="column" gap="md">
              <Stack direction="row-wrap" gap="sm" align="center">
                {buttonVariants.map((variant) => (
                  <Button key={variant} variant={variant} loading={false}>
                    {variant.charAt(0).toUpperCase() + variant.slice(1)}
                  </Button>
                ))}
              </Stack>
              <Divider />
              <Stack direction="row-wrap" gap="sm" align="center">
                {buttonSizes.map((size) => (
                  <Button key={size} size={size} variant="primary">
                    {size.toUpperCase()}
                  </Button>
                ))}
              </Stack>
              <Divider />
              <Stack direction="row" gap="sm">
                <Button variant="secondary" leadingIcon={<SparklesIcon />}>
                  Launch flow
                </Button>
                <Button variant="outline" trailingIcon={<ArrowRightIcon />}>
                  View report
                </Button>
                <Button loading variant="primary">
                  Loading…
                </Button>
                <Button variant="outline" disabled>
                  Disabled state
                </Button>
              </Stack>
            </Stack>
          </ShowcaseSection>

          <ShowcaseSection
            title="Badges"
            description="Accent chips for quick status signals."
          >
            <Stack direction="row-wrap" gap="sm" align="center">
              <Badge tone="neutral" variant="soft">
                Neutral soft
              </Badge>
              <Badge tone="neutral" variant="outline">
                Neutral outline
              </Badge>
              <Badge tone="brand" variant="solid">
                Brand
              </Badge>
              <Badge tone="success" variant="soft">
                Success
              </Badge>
              <Badge tone="warning" variant="soft">
                Warning
              </Badge>
              <Badge tone="danger" variant="soft">
                Risk
              </Badge>
            </Stack>
          </ShowcaseSection>

          <ShowcaseSection
            title="Icons"
            description="Common glyphs for actions and status indicators."
          >
            <Stack direction="row-wrap" gap="md">
              {iconShowcase.map(({ name, Icon }) => (
                <div
                  key={name}
                  className="flex min-w-32 items-center gap-3 rounded-(--radius-sm) border border-border/60 bg-surface px-4 py-3"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-soft">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {name}
                  </span>
                </div>
              ))}
            </Stack>
          </ShowcaseSection>

          <ShowcaseSection
            title="Form fields"
            description="Inputs, selects, textareas and messaging."
          >
            <Stack gap="md">
              <Field
                label="Greeting title"
                labelFor="greeting-title"
                hint="Visible to everyone in the list."
                required
              >
                <Input id="greeting-title" placeholder="e.g. Hello world" />
              </Field>

              <Field
                label="Greeting message"
                labelFor="greeting-message"
                description="Keep it short and clear."
              >
                <Textarea
                  id="greeting-message"
                  placeholder="It's a beautiful day to craft UI components."
                />
              </Field>

              <Field
                label="Country"
                labelFor="greeting-country"
                hint="Used to localise the greeting."
              >
                <Select id="greeting-country" defaultValue={countryOptions[0]}>
                  {countryOptions.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field
                label="API key"
                labelFor="greeting-api-key"
                error="Invalid or expired token"
                required
              >
                <Input
                  id="greeting-api-key"
                  placeholder="sk_live_xxxxxxxxx"
                  invalid
                />
              </Field>
            </Stack>
          </ShowcaseSection>

          <ShowcaseSection
            title="Cards"
            description="Surface content blocks with header, body and footer."
          >
            <Card>
              <CardHeader>
                <Stack direction="row" justify="between" align="center">
                  <Stack gap="xs">
                    <CardTitle>Greetings summary</CardTitle>
                    <CardDescription>
                      Snapshot of API usage today.
                    </CardDescription>
                  </Stack>
                  <Badge tone="brand" variant="soft">
                    Updated just now
                  </Badge>
                </Stack>
              </CardHeader>
              <CardContent className="gap-4">
                <Stack direction="row-wrap" gap="md">
                  <StatBox label="Total greetings" value="42" />
                  <StatBox label="Unique countries" value="12" />
                  <StatBox label="Failures" value="1" tone="danger" />
                </Stack>
                <Divider />
                <HelperText tone="muted">
                  Data refreshes automatically every 5 minutes.
                </HelperText>
              </CardContent>
              <CardFooter>
                <Stack direction="row" gap="sm">
                  <Button variant="primary" size="sm">
                    Refresh now
                  </Button>
                  <Button variant="ghost" size="sm">
                    View analytics
                  </Button>
                </Stack>
              </CardFooter>
            </Card>
          </ShowcaseSection>

          <ShowcaseSection
            title="Skeleton"
            description="Animated placeholders to indicate loading states."
          >
            <Stack gap="sm">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-full" />
              <Stack direction="row" gap="sm">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </Stack>
            </Stack>
          </ShowcaseSection>
        </Stack>
      </Stack>
    </div>
  );
}

function ShowcaseSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <Stack gap="xs">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </Stack>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
