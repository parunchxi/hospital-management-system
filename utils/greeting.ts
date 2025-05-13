export const getGreeting = (hour: number = new Date().getHours()) => {
  const morningGreetings = [
    'Good Morning!',
    'Rise and shine!',
    'Top of the morning to you!',
    'Wakey wakey, eggs and bakey!',
    'Morning sunshine!',
  ]

  const afternoonGreetings = [
    'Good Afternoon!',
    'Hope your day is going great!',
    'Keep pushing through!',
    'Halfway there!',
    'Hey there, afternoon warrior!',
  ]

  const eveningGreetings = [
    'Good Evening!',
    'Hope you had a great day!',
    'Time to unwind!',
    'Evening vibes!',
    'Relax, you’ve earned it!',
  ]

  const randomIndex = (arr: string[]) => Math.floor(hour % arr.length)

  if (hour < 12) {
    return morningGreetings[randomIndex(morningGreetings)]
  } else if (hour < 18) {
    return afternoonGreetings[randomIndex(afternoonGreetings)]
  } else {
    return eveningGreetings[randomIndex(eveningGreetings)]
  }
}
