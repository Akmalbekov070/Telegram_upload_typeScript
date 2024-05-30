'use client';

import { formSchema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { z } from 'zod';
import { log } from 'console';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { toast } from 'sonner';

export default function ContactMe() {
	const [load, setLoad] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: '',
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		setLoad(true);
		const telegramBotId = process.env.NEXT_PUBLIC_TELEGRAM_API;
		const telegramBotKey = process.env.NEXT_PUBLIC_TELEGRAM_KEY_API;

		const promise = fetch(`https://api.telegram.org/bot${telegramBotId}/sendMessage`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'no-cache',
			},
			body: JSON.stringify({
				chat_id: telegramBotKey,
				text: `Name: ${values.username},
				
				`,
			}),
		})
			.then(() => form.reset())
			.finally(() => setLoad(false));
		toast.promise(promise, {
			loading: 'Loading...',
			success: 'Succsesfully send',
			error: 'wrong....',
		});
	}

	return (
		<div className='w-full h-[100vh] flex justify-center items-center flex-col bg-slate-800 text-white'>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
					<FormField
						control={form.control}
						name='username'
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input placeholder='Write your name' {...field} disabled={load} className='w-[300px] bg-slate-800' />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type='submit' disabled={load}>
						Submit
					</Button>
				</form>
			</Form>
		</div>
	);
}
