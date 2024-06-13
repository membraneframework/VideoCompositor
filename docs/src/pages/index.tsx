import clsx from 'clsx';
import { FaBook, FaCode, FaDocker, FaGears, FaGithub, FaLink } from 'react-icons/fa6';
import { FaServer } from 'react-icons/fa';
import { GiFeather, GiBattery100, GiSpeedometer } from 'react-icons/gi';
import { IoCloudOffline } from 'react-icons/io5';
import { MdAudiotrack, MdLiveTv } from 'react-icons/md';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';
import { PropsWithChildren } from 'react';
import { IconContext, IconType } from 'react-icons';
import MembraneLogo from '@site/static/img/membrane-logo.svg';
import SwmLogo from '@site/static/img/swm-logo.svg';
import ComposingImg from '@site/static/img/how_it_works.png';
import WebGpuLogoDark from '@site/static/img/webgpu-dark.svg';
import WebGpuLogoLight from '@site/static/img/webgpu-light.svg';
import VideoConferencingImg from '@site/static/img/videoconferencing.jpg';
import StreamingImg from '@site/static/img/streaming.jpg';
import BroadcastingImg from '@site/static/img/broadcasting.jpg';
import { useColorMode } from '@docusaurus/theme-common';
import TypewriterComponent from 'typewriter-effect';
import ExampleScene from '../components/example_scene';

function HomepageHeader() {
  return (
    <div className={clsx('container', styles.firstSection)}>
      <div className="row">
        <div className="col col--6">
          <div className="container">
            <Heading as="h1" style={{ fontSize: 55 }}>
              <span className="text--primary">Mix video and audio</span>
              <div className={styles.typewriter}>
                <TypewriterComponent
                  options={{
                    strings: ['in real-time.', 'using code.', 'with low latency.'],
                    autoStart: true,
                    loop: true,
                    deleteSpeed: 50,
                    delay: 80,
                  }}
                />
              </div>
            </Heading>
            <p className={styles.sectionSubheading}>
              Media server for real-time, low latency, programmable video and audio mixing.
            </p>
            <div className="row margin-bottom--md">
              <Link
                className={clsx(
                  'button button--primary button--lg col col-6 margin--sm',
                  styles.hoverPrimary
                )}
                to="/docs/intro">
                <IconContext.Provider value={{ style: { verticalAlign: 'middle' } }}>
                  <FaBook style={{ marginRight: 3 }} />
                  Docs
                </IconContext.Provider>
              </Link>
              <Link
                className={clsx(
                  'button button--secondary button--outline button--lg col col-6 margin--sm',
                  styles.hoverSecondary
                )}
                to="https://github.com/membraneframework/live_compositor">
                <IconContext.Provider value={{ style: { verticalAlign: 'middle' } }}>
                  <FaGithub style={{ marginRight: 5 }} />
                  View on GitHub
                </IconContext.Provider>
              </Link>
            </div>
          </div>
        </div>
        <div className="col col--6">
          <div
            style={{
              borderRadius: '30px',
              overflow: 'hidden',
            }}>
            <video
              loop
              autoPlay
              muted
              src="https://github.com/membraneframework/live_compositor/assets/104033489/e6f5ba7c-ab05-4935-a42a-bc28c42fc895"
              poster="/img/demo_poster.jpg"
              style={{ width: '100%', display: 'block' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function HowItWorks() {
  return (
    <div className="container margin-top--md">
      <Heading as="h1" className="margin-bottom--md text--center text--primary">
        How it works?
      </Heading>
      <p className={clsx('text--center', styles.sectionSubheading)}>
        1. Send inputs as RTP streams or MP4 files
        <br />
        2. Configure mixing with HTTP requests
        <br />
        3. Get the mixed streams via RTP
      </p>
      <div className="row">
        <div className="col col--6">
          <img src={ComposingImg} alt="Composing" />
        </div>
        <div className={clsx('col col--6', styles.sceneExample)}>
          <ExampleScene />
        </div>
      </div>
    </div>
  );
}

function UseCases() {
  return (
    <div className="container margin-top--md">
      <Heading as="h1" className="margin-bottom--md text--center text--primary">
        Use cases
      </Heading>
      <p className={clsx('text--center', styles.sectionSubheading)}>
        Use LiveCompositor for video conferencing, live-streaming, broadcasting, and more.
      </p>
      <div className="row">
        <UseCaseCard
          title="Video conferencing"
          subtitle="Stream or record video conferences"
          img={VideoConferencingImg}
        />
        <UseCaseCard title="Broadcasting" subtitle="Compose broadcasts" img={BroadcastingImg} />
        <UseCaseCard
          title="Live-streaming"
          subtitle="Create awesome live-streams"
          img={StreamingImg}
        />
      </div>
    </div>
  );
}

type UseCaseCardProps = {
  title: string;
  subtitle: string;
  img: any;
};

function UseCaseCard(props: UseCaseCardProps) {
  return (
    <div className={clsx('card', styles.card, styles.hoverPrimary)}>
      <div className="text--primary">
        <Heading as="h2" style={{ textAlign: 'center', margin: 0 }}>
          {props.title}
        </Heading>
      </div>
      <p className={clsx('text--center', styles.sectionSubheading)} style={{ margin: 0 }}>
        {props.subtitle}
      </p>
      <div className="card__body">
        <img src={props.img} alt={props.title} />
      </div>
    </div>
  );
}

function VisionCards() {
  return (
    <div className="container margin-top--md">
      <Heading as="h1" className="margin-bottom--md text--center text--primary">
        Vision
      </Heading>
      <p className={clsx('text--center', styles.sectionSubheading)}>
        Make mixing live streams as simple as building a website.
      </p>
      <div className="row">
        <VisionCard title="Simple declarative API" icon={FaCode}>
          <p className="padding--md">
            Mixing is specified using simple component tree, easy to pick up for anyone familiar
            with web development.
          </p>
        </VisionCard>
        <VisionCard title="Easy integration" icon={FaLink}>
          <p className="padding--md">
            API is language agnostic. You can leverage tech stack of your choice and easily
            integrate it with your own solutions.
          </p>
        </VisionCard>
        <VisionCard title="Real-time and low latency" icon={GiSpeedometer}>
          <p className="padding--md">
            LiveCompositor targets real-time use cases, with a significant focus on situations where
            latency is critical.
          </p>
        </VisionCard>
      </div>
    </div>
  );
}

type VisionCardProps = {
  title: string;
  icon: IconType;
};

function VisionCard(props: PropsWithChildren<VisionCardProps>) {
  const Icon = props.icon;
  return (
    <div className={clsx('card', styles.card, styles.hoverPrimary)}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Icon className={styles.icon} />
      </div>
      <div className="card__header">
        <Heading as="h2" style={{ textAlign: 'center' }}>
          {props.title}
        </Heading>
      </div>
      <div className="card__body">{props.children}</div>
    </div>
  );
}

type FeatureProps = {
  text: string;
  secondaryText?: string;
  image: any;
};

function Feature(props: PropsWithChildren<FeatureProps>) {
  const text = (
    <div className="col">
      <Heading as="h2" className="margin-top--sm">
        {props.text}
      </Heading>
      <p>{props.secondaryText}</p>
    </div>
  );
  return (
    <div className="row margin-right--lg margin-left--lg" style={{ alignItems: 'center' }}>
      {props.image}
      <div className="col">
        {text}
        {props.children}
      </div>
    </div>
  );
}

function Features() {
  const { colorMode } = useColorMode();

  const wgpuLogo =
    colorMode === 'dark' ? (
      <WebGpuLogoDark className={styles.featureIcon} width={80} height={80} />
    ) : (
      <WebGpuLogoLight className={styles.featureIcon} width={80} height={80} />
    );

  return (
    <div className="container margin-top--lg margin-bottom--md">
      <Heading as="h1" className="margin-bottom--md text--center text--primary">
        Capabilities
      </Heading>
      <p className={clsx('text--center', styles.sectionSubheading)}>
        Simple, powerful, fast. Pick three.
      </p>

      <Feature
        text="Batteries included"
        secondaryText="Process streams, render text, images, GIFs or websites, and combine them into output streams using high-level components."
        image={<GiBattery100 className={styles.featureIcon} style={{ fontSize: 80 }} />}
      />

      <Feature
        text="Highly customizable"
        secondaryText="Create custom effects with WGSL shaders and directly leverage GPU parallel processing capabilities."
        image={<FaGears className={styles.featureIcon} style={{ fontSize: 80 }} />}
      />

      <Feature
        text="Audio support"
        secondaryText="Mix audio directly in LiveCompositor."
        image={<MdAudiotrack className={styles.featureIcon} style={{ fontSize: 80 }} />}
      />

      <Feature
        text="WebGPU and Rust"
        secondaryText="Leverage Rust and WebGPU rendering for great performance."
        image={wgpuLogo}
      />

      <Feature
        text="Animated transitions"
        secondaryText="Change layouts on the fly with animated transitions."
        image={<GiFeather className={styles.featureIcon} style={{ fontSize: 80 }} />}
      />

      <Feature
        text="Real-time processing"
        secondaryText="Process live streams in real-time with low latency."
        image={<MdLiveTv className={styles.featureIcon} style={{ fontSize: 80 }} />}
      />

      <Feature
        text="Offline processing"
        secondaryText="Use LiveCompositor for non-real-time use cases with offline processing mode."
        image={<IoCloudOffline className={styles.featureIcon} style={{ fontSize: 80 }} />}
      />
    </div>
  );
}

function StandaloneSever() {
  return (
    <div className="row" style={{ justifyContent: 'center' }}>
      <FaServer className="margin--lg" style={{ fontSize: 150, alignSelf: 'center' }} />
      <div className="col">
        <div className="card">
          <div className="card__header">
            <Heading as="h3" className="margin-top--sm">
              Standalone server
            </Heading>
          </div>
          <div className="card__body container">
            <p>
              LiveCompositor can be deployed as a standalone server. Language-agnostic API allows
              you to seamlessly integrate it into your existing solutions. Dockerfiles and
              deployment section in docs are meant to make the deployment process as easy as
              possible.
            </p>
            <div className="row margin--sm" style={{ justifyContent: 'end' }}>
              <Link
                className={clsx(
                  'button button--secondary button--outline button--lg margin--sm',
                  styles.hoverSecondary,
                  styles.smallScreenFlexButton
                )}
                to="/docs/deployment/overview">
                <IconContext.Provider value={{ style: { verticalAlign: 'middle' } }}>
                  <FaBook style={{ marginRight: 5 }} />
                  Docs
                </IconContext.Provider>
              </Link>
              <Link
                className={clsx(
                  'button button--secondary button--outline button--lg margin--sm',
                  styles.hoverSecondary,
                  styles.smallScreenFlexButton
                )}
                to="https://github.com/membraneframework/live_compositor/tree/master/build_tools/docker">
                <IconContext.Provider value={{ style: { verticalAlign: 'middle' } }}>
                  <FaDocker style={{ marginRight: 5 }} />
                  Dockerfiles
                </IconContext.Provider>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MembranePlugin() {
  return (
    <div className="row" style={{ justifyContent: 'center' }}>
      <MembraneLogo
        width={150}
        height={150}
        className="margin--lg"
        style={{ alignSelf: 'center' }}
      />
      <div className="col">
        <div className="card">
          <div className="card__header">
            <Heading as="h3" className="margin-top--sm">
              Membrane plugin
            </Heading>
          </div>
          <div className="card__body container">
            <p>
              Membrane is a developer-friendly multimedia framework for Elixir. You can easily add
              video and audio composing functionality into your multimedia pipeline using Membrane
              LiveCompositor Plugin.
            </p>
            <div className="row margin--sm" style={{ justifyContent: 'end' }}>
              <Link
                className={clsx(
                  'button button--secondary button--outline button--lg margin--sm',
                  styles.hoverSecondary,
                  styles.smallScreenFlexButton
                )}
                to="https://hexdocs.pm/membrane_live_compositor_plugin/0.9.0/Membrane.LiveCompositor.html">
                <IconContext.Provider value={{ style: { verticalAlign: 'middle' } }}>
                  <FaBook style={{ marginRight: 5 }} />
                  Docs
                </IconContext.Provider>
              </Link>
              <Link
                className={clsx(
                  'button',
                  'button--secondary',
                  'button--outline',
                  'button--lg',
                  'margin--sm',
                  styles.hoverSecondary,
                  styles.smallScreenFlexButton
                )}
                to="https://github.com/membraneframework/membrane_live_compositor_plugin">
                <IconContext.Provider value={{ style: { verticalAlign: 'middle' } }}>
                  <FaGithub style={{ marginRight: 5 }} />
                  Repository
                </IconContext.Provider>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Usage() {
  return (
    <div className="container">
      <Heading as="h1" className="margin-bottom--md text--center text--primary">
        Usage
      </Heading>
      <StandaloneSever />
      <br />
      <MembranePlugin />
    </div>
  );
}

function ContactUs() {
  return (
    <div className="container margin-bottom--lg">
      <div className="card container">
        <div className="row" style={{ justifyContent: 'center' }}>
          <SwmLogo width={220} className="margin--lg" style={{ alignSelf: 'center' }} />
          <div className="col">
            <div className="card__header margin-top--md">
              <Heading as="h1">
                <span className="text--primary">Contact</span> us
              </Heading>
            </div>
            <div className="card__body">
              <p className={clsx(styles.sectionSubheading, 'margin-bottom--md')}>
                LiveCompositor is developed by Software Mansion - a software company that is
                specialized in building tools for developers. At Software Mansion, we work on
                multiple multimedia projects, like Membrane Framework, Elixir WebRTC, FishJam, and
                more. We also work on custom solutions for clients. Email us at{' '}
                <Link to="mailto:projects@swmansion.com">projects@swmansion.com</Link> or contact us
                via <Link to="https://membrane.stream/contact">this form</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Tool for real-time video processing / transforming / composing">
      <HomepageHeader />
      <div className={styles.sectionSeparator} />
      <HowItWorks />
      <div className={styles.sectionSeparator} />
      <UseCases />
      <div className={styles.sectionSeparator} />
      <VisionCards />
      <div className={styles.sectionSeparator} />
      <Features />
      <div className={styles.sectionSeparator} />
      <Usage />
      <div className={styles.sectionSeparator} />
      <ContactUs />
    </Layout>
  );
}
