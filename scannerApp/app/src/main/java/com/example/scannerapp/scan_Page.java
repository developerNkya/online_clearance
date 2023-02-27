package com.example.scannerapp;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.google.zxing.integration.android.IntentIntegrator;
import com.google.zxing.integration.android.IntentResult;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

public class scan_Page extends AppCompatActivity implements View.OnClickListener
{

    Button scanBtn;
    TextView messageText, messageFormat;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.scan);

        // referencing and initializing
        // the button and textviews
        scanBtn = findViewById(R.id.scanBtn);
        messageText = findViewById(R.id.textContent);
        messageFormat = findViewById(R.id.textFormat);

        // adding listener to the button
        scanBtn.setOnClickListener(this);

    }

    @Override
    public void onClick(View v) {
        // we need to create the object
        // of IntentIntegrator class
        // which is the class of QR library
        IntentIntegrator intentIntegrator = new IntentIntegrator(this);
        intentIntegrator.setPrompt("Scan a barcode or QR Code");
        intentIntegrator.setOrientationLocked(true);
        intentIntegrator.initiateScan();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        IntentResult intentResult = IntentIntegrator.parseActivityResult(requestCode, resultCode, data);
        // if the intentResult is null then
        // toast a message as "cancelled"
        if (intentResult != null) {
            if (intentResult.getContents() == null) {
                Toast.makeText(getBaseContext(), "Cancelled", Toast.LENGTH_SHORT).show();
            } else {
                // if the intentResult is not null we'll set
                // the content and format of scan message
                messageText.setText(intentResult.getContents());
                messageFormat.setText(intentResult.getFormatName());

                //Go to api and check if student is registered
                String url1 = "http://onlineclearance.atwebpages.com/Test.php?REGISTRATION=" + intentResult.getContents();
                GetMethodDemo GetMethodDemo = new GetMethodDemo(); // can add params for a constructor if needed
                new GetMethodDemo().execute(url1);

            }
        } else {
            super.onActivityResult(requestCode, resultCode, data);
        }
    }

    public class GetMethodDemo extends AsyncTask<String , Void ,String>
    {
        String server_response;
        Context mContext;





        @Override
        protected String doInBackground(String... strings) {

            URL url;
            HttpURLConnection urlConnection = null;




            try {
                url = new URL(strings[0]);
                urlConnection = (HttpURLConnection) url.openConnection();

                int responseCode = urlConnection.getResponseCode();

                if(responseCode == HttpURLConnection.HTTP_OK){
                    server_response = readStream(urlConnection.getInputStream());
                    Log.v("CatalogClient", server_response);
                }

            } catch (MalformedURLException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }

            return null;
        }

        @Override
        protected void onPostExecute(String s) {
            super.onPostExecute(s);

            Log.e("Response", "" + server_response);

            //returning toast message::







            try
            {



                JSONObject jObj = new JSONObject(server_response);
                if (jObj.getInt("status") == 1)
                {
                    System.out.println("Login success");

                    Log.e("status", "" + "Allowed");

                    //toast
                    messageText.setText("user exists");
                    Toast.makeText( scan_Page.this, "Student is registered!", Toast.LENGTH_LONG).show();



//
//                    Intent intent = new Intent(MainActivity.this, scan_Page.class);
//                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
//                    MainActivity.this.startActivity(intent);



                }
                else
                {
                    //System.out.println("Login fail");

                    Log.e("status", "" + "Denied");

                    messageText.setText("user doesnt exists");
//                    Toast.makeText(MainActivity.this, "Incorrect credidentials...Try again!", Toast.LENGTH_LONG).show();
                    Toast.makeText( scan_Page.this, "Student is not registered!", Toast.LENGTH_LONG).show();

                }
            }

            catch (JSONException e)
            {}

        }











// Converting InputStream to String

        private String readStream(InputStream in) {
            BufferedReader reader = null;
            StringBuffer response = new StringBuffer();
            try {
                reader = new BufferedReader(new InputStreamReader(in));
                String line = "";
                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
            } catch (IOException e) {
                e.printStackTrace();
            } finally {
                if (reader != null) {
                    try {
                        reader.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
            return response.toString();


        }




    }

}