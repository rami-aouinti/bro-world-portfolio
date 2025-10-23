<template>
  <LayoutLine />
  <LayoutScrollSmooth>
    <section id="contact" class="container">
      <div class="max-w-5xl mx-auto">
        <p class="badge flex items-center gap-2 w-fit">
          <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          Contact
        </p>
        <h1 class="section-title">Let’s create something remarkable together.</h1>
        <p class="paragraph mt-4 max-w-2xl">
          Whether you have a question, a project idea, or just want to say hello, feel free to reach out. I’m always excited to
          collaborate on new challenges and craft intuitive experiences.
        </p>

        <div class="grid gap-8 mt-12 lg:grid-cols-[1.2fr_0.8fr]">
          <form class="card gap-6" @submit.prevent>
            <div class="grid gap-6 md:grid-cols-2">
              <div class="flex flex-col gap-2">
                <label class="text-xs tracking-[0.3em] uppercase text-white/40">Name</label>
                <input
                  type="text"
                  name="name"
                  autocomplete="name"
                  placeholder="Your name"
                  class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 transition focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/60"
                />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-xs tracking-[0.3em] uppercase text-white/40">Email</label>
                <input
                  type="email"
                  name="email"
                  autocomplete="email"
                  placeholder="you@example.com"
                  class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 transition focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/60"
                />
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-xs tracking-[0.3em] uppercase text-white/40">Project Details</label>
              <textarea
                name="message"
                rows="6"
                placeholder="Tell me more about your project, timeline, and goals."
                class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 transition focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/60"
              ></textarea>
            </div>
            <button type="submit" class="btn-primary inline-flex items-center justify-center">
              Send Message
            </button>
          </form>

          <div class="card gap-6">
            <div>
              <h2 class="text-xl font-semibold text-white">Direct Contact</h2>
              <p class="paragraph mt-2">
                Prefer a quick chat? Drop me a message and I’ll get back to you within one business day.
              </p>
            </div>
            <div class="flex flex-col gap-5">
              <div class="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <VsxIcon iconName="Message" :size="24" type="linear" />
                </div>
                <div>
                  <p class="text-sm uppercase tracking-[0.3em] text-white/40">Email</p>
                  <a class="mt-1 text-lg font-medium text-white transition hover:text-primary" href="mailto:hello@broworld.dev">
                    hello@broworld.dev
                  </a>
                </div>
              </div>
              <div class="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <VsxIcon iconName="Location" :size="24" type="linear" />
                </div>
                <div>
                  <p class="text-sm uppercase tracking-[0.3em] text-white/40">Location</p>
                  <p class="mt-1 text-lg font-medium text-white">Jakarta, Indonesia</p>
                </div>
              </div>
              <div class="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <VsxIcon iconName="Clock" :size="24" type="linear" />
                </div>
                <div>
                  <p class="text-sm uppercase tracking-[0.3em] text-white/40">Availability</p>
                  <p class="mt-1 text-lg font-medium text-white">Weekdays, 9am – 6pm (GMT+7)</p>
                </div>
              </div>
            </div>
            <Button to="https://cal.com/" label="Schedule a Call" variant="btn-dark" />
          </div>
        </div>
      </div>
    </section>
  </LayoutScrollSmooth>
  <LayoutLine />
</template>
