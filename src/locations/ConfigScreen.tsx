import { ConfigAppSDK } from '@contentful/app-sdk';
import { 
  Flex, 
  Form, 
  FormControl,
  TextInput,
  Heading, 
  Paragraph,
  Note
} from '@contentful/f36-components';
import { useSDK } from '@contentful/react-apps-toolkit';
import { css } from 'emotion';
import { useCallback, useEffect, useState } from 'react';

export interface AppInstallationParameters {
  huggingfaceApiKey?: string;
  textModelId?: string;
  imageModelId?: string;
}

const ConfigScreen = () => {
  const [parameters, setParameters] = useState<AppInstallationParameters>({
    huggingfaceApiKey: '',
    textModelId: 'meta-llama/Llama-3.2-3B-Instruct',
    imageModelId: 'black-forest-labs/FLUX.1-dev'
  });
  const sdk = useSDK<ConfigAppSDK>();

  const onConfigure = useCallback(async () => {
    // Validate the form
    const valid = Boolean(
      parameters.huggingfaceApiKey &&
      parameters.textModelId &&
      parameters.imageModelId
    );

    if (!valid) return false;

    const currentState = await sdk.app.getCurrentState();

    return {
      parameters,
      targetState: currentState,
    };
  }, [parameters, sdk]);

  useEffect(() => {
    sdk.app.onConfigure(() => onConfigure());
  }, [sdk, onConfigure]);

  useEffect(() => {
    (async () => {
      const currentParameters: AppInstallationParameters | null = await sdk.app.getParameters();
      if (currentParameters) {
        setParameters(currentParameters);
      }
      sdk.app.setReady();
    })();
  }, [sdk]);

  const handleChange = (key: keyof AppInstallationParameters) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setParameters((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  return (
    <Flex flexDirection="column" className={css({ margin: '80px', maxWidth: '800px' })}>
      <Form>
        <Heading>Hugging Face Integration Configuration</Heading>
        <Paragraph>Configure your Hugging Face API settings to enable AI image generation.</Paragraph>
        
        <Note variant="warning" title="Security Notice" className={css({ margin: '24px 0' })}>
          Your API key will be stored securely in Contentful. Never share or expose your API key in client-side code.
        </Note>

        <FormControl isRequired marginBottom="spacingM">
          <FormControl.Label>Hugging Face API Key</FormControl.Label>
          <TextInput
            type="password"
            name="huggingfaceApiKey"
            value={parameters.huggingfaceApiKey || ''}
            onChange={handleChange('huggingfaceApiKey')}
            placeholder="hf_..."
          />
          <FormControl.HelpText>
            Enter your Hugging Face API key. You can find this in your Hugging Face account settings.
          </FormControl.HelpText>
        </FormControl>

        <Note variant="primary" title="Model Requirements" className={css({ margin: '24px 0' })}>
          The selected models must be available on the Hugging Face Inference API to work with this integration.
        </Note>

        <FormControl isRequired marginBottom="spacingM">
          <FormControl.Label>Text Model ID</FormControl.Label>
          <TextInput
            name="textModelId"
            value={parameters.textModelId || ''}
            onChange={handleChange('textModelId')}
            placeholder="meta-llama/Llama-3.2-3B-Instruct"
          />
          <FormControl.HelpText>
            Enter the Hugging Face model ID for text processing. (Must be a Text Generation model)
          </FormControl.HelpText>
        </FormControl>

        <FormControl isRequired marginBottom="spacingM">
          <FormControl.Label>Image Model ID</FormControl.Label>
          <TextInput
            name="imageModelId"
            value={parameters.imageModelId || ''}
            onChange={handleChange('imageModelId')}
            placeholder="black-forest-labs/FLUX.1-dev"
          />
          <FormControl.HelpText>
            Enter the Hugging Face model ID for image generation. (Must be a Text-to-Image model)
          </FormControl.HelpText>
        </FormControl>
      </Form>
    </Flex>
  );
};

export default ConfigScreen;
