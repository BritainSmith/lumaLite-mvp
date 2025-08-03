import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CompanionAgentService } from './services/companionAgent.service';
import * as readlineSync from "readline-sync";
import chalk from "chalk";

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const companionService = app.get(CompanionAgentService);

  console.clear();
  console.log(chalk.cyanBright.bold("\n🌟 Welcome to LumaLite – Your Supportive AI Companion 🌟\n"));

  const menuOptions = [
    "Emotional Check-In",
    "Organize My Brain Dump",
    "Exit"
  ];

  let exit = false;

  while (!exit) {
    const index = readlineSync.keyInSelect(menuOptions, chalk.green("\nWhat would you like to do today?"));
    
    switch (index) {
      case 0: { // Emotional Check-In
        const input = readlineSync.question(chalk.yellowBright("\nHow are you feeling right now?\n> "));
        const response = await companionService.handleCheckIn(input);
        console.log(chalk.blueBright("\n💬 LumaLite says:"));
        console.log(response);
        break;
      }

      case 1: { // Organize Brain Dump
        const dump = readlineSync.question(chalk.yellowBright("\nWhat's on your mind? Just let it all out:\n> "));
        const result = await companionService.sortBrainDump(dump);
        console.log(chalk.magentaBright("\n🧠 Organized Thoughts:"));
        console.dir(result, { depth: null });
        break;
      }

      case 2: // Exit
      default:
        exit = true;
        console.log(chalk.cyanBright("\nTake care, Brit. Come back when you're ready 🌼\n"));
        break;
    }
  }

  await app.close();
}

bootstrap(); 